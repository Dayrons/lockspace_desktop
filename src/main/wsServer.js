const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const { Password } = require("./models/Password");
const { User } = require("./models/User");

const WS_PORT = 8765;

let wss = null;
let flutterClient = null; // La conexión activa de la app Flutter
let globalWindow = null;  // Referencia al BrowserWindow para IPC
let logToFile = () => {}; // Se inyecta desde main.js
let onUserAuthenticated = null; // Callback cuando Flutter se autentica

/**
 * Inicia el WebSocket server.
 * @param {BrowserWindow} window - para enviar IPC al renderer
 * @param {Function} logger - función logToFile de main.js
 * @param {Function} onAuth - callback(usuario) cuando Flutter se autentica por WS
 */
function startWsServer(window, logger, onAuth) {
  globalWindow = window;
  logToFile = logger;
  onUserAuthenticated = onAuth;

  wss = new WebSocket.Server({ port: WS_PORT });

  wss.on("connection", (ws, req) => {
    // Validar token JWT del query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      ws.close(4001, "Token requerido");
      return;
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret());
      logToFile(`WS: cliente conectado desde app (user: ${decoded.username})`);
    } catch (e) {
      ws.close(4001, "Token inválido");
      return;
    }

    // Solo una conexión a la vez (la app Flutter)
    if (flutterClient && flutterClient.readyState === WebSocket.OPEN) {
      flutterClient.close(4002, "Otra conexión activa");
    }

    flutterClient = ws;

    // Notificar al renderer que la app está conectada
    globalWindow.webContents.send("ftp-client-connected");

    ws.on("message", async (data) => {
      try {
        const raw = data.toString();
        logToFile(`WS: mensaje recibido: ${raw.substring(0, 200)}`);
        const msg = JSON.parse(raw);
        await handleMessage(msg);
      } catch (e) {
        logToFile(`WS: error procesando mensaje: ${e.message}`);
      }
    });

    ws.on("close", () => {
      logToFile("WS: cliente desconectado");
      flutterClient = null;
      globalWindow.webContents.send("ftp-client-disconnected");
    });

    ws.on("error", (err) => {
      logToFile(`WS: error de conexión: ${err.message}`);
    });

    // Si no hay un usuario autenticado en el desktop, pedir contraseña
    // (primera sincronización). El renderer mostrará la modal.
    if (!globalUser) {
      logToFile("WS: primera sincronización, pidiendo contraseña");
      globalWindow.webContents.send("show-modal-password");
    }
  });

  wss.on("error", (err) => {
    logToFile(`WS server error: ${err.message}`);
  });

  logToFile(`WebSocket server iniciado en puerto ${WS_PORT}`);
}

/**
 * JWT secret - generado aleatoriamente al iniciar la app.
 * Se comparte con getHostname para firmar el token del QR.
 */
let _jwtSecret = null;
function getJwtSecret() {
  if (!_jwtSecret) {
    const crypto = require("crypto");
    _jwtSecret = crypto.randomBytes(64).toString("hex");
  }
  return _jwtSecret;
}

/**
 * Genera el JWT token para el QR (contiene host y ws port).
 */
function generateQrToken(host) {
  const crypto = require("crypto");
  const macAddress = getMacAddress();
  const data = {
    host: host,
    port: WS_PORT,
    username: macAddress,
    password: "password", // Credencial simple para compatibilidad
  };
  return jwt.sign(data, getJwtSecret(), { expiresIn: "1h" });
}

/**
 * Procesa mensajes entrantes de la app Flutter.
 */
async function handleMessage(msg) {
  const { type, password: pwdData, passwords: pwdList, user: userData } = msg;

  // Si el mensaje incluye datos de usuario y no tenemos globalUser,
  // buscar o crear el usuario localmente (primera sincronización)
  if (userData && !globalUser) {
    try {
      const [user, _] = await User.findOrCreate({
        where: { uuid: userData.uuid },
        defaults: {
          name: (userData.name || "").toLowerCase(),
          password: userData.password,
          uuid: userData.uuid,
        },
      });
      globalUser = user;
      onUserAuthenticated?.(user);
      logToFile(`WS: usuario encontrado/creado: ${user.name}`);
    } catch (e) {
      logToFile(`WS: error creando usuario: ${e.message}`);
    }
  }

  switch (type) {
    case "sync_request":
      // Flutter pide todos los passwords del desktop + envía los suyos
      await handleSyncRequest(msg.passwords);
      break;

    case "password_created":
      // Flutter creó un password → merge en desktop
      await handlePasswordCreated(pwdData);
      // Notificar al renderer para refrescar la lista
      globalWindow.webContents.send("sync-completed", { created: 1, updated: 0 });
      break;

    case "password_updated":
      // Flutter actualizó un password → merge en desktop
      await handlePasswordUpdated(pwdData);
      // Notificar al renderer para refrescar la lista
      globalWindow.webContents.send("sync-completed", { created: 0, updated: 1 });
      break;

    default:
      logToFile(`WS: tipo de mensaje desconocido: ${type}`);
  }
}

/**
 * Envía todos los passwords del usuario a Flutter (sync inicial).
 * También procesa los passwords que envió Flutter (merge bidireccional).
 */
async function handleSyncRequest(flutterPasswords) {
  if (!globalUser) return;

  // Procesar passwords del Flutter (si los hay)
  if (flutterPasswords != null && flutterPasswords.length > 0) {
    for (const incoming of flutterPasswords) {
      try {
        const existing = await Password.findOne({
          where: { uuid: incoming.uuid, UserId: globalUser.id },
        });

        if (!existing) {
          await Password.create({
            uuid: incoming.uuid,
            title: incoming.title,
            password: incoming.password,
            expiration: incoming.expiration || 0,
            expirationUnit: incoming.expiration_unit || "never",
            UserId: globalUser.id,
            createdAt: incoming.created_at ? new Date(incoming.created_at) : undefined,
            updatedAt: incoming.updated_at ? new Date(incoming.updated_at) : undefined,
          });
        } else {
          const localUpdated = new Date(existing.updatedAt).getTime();
          const remoteUpdated = incoming.updated_at ? new Date(incoming.updated_at).getTime() : 0;
          if (remoteUpdated > localUpdated) {
            await existing.update({
              title: incoming.title,
              password: incoming.password,
              expiration: incoming.expiration || 0,
              expirationUnit: incoming.expiration_unit || "never",
              updatedAt: new Date(incoming.updated_at),
            });
          }
        }
      } catch (e) {
        logToFile(`WS: error merging password uuid=${incoming.uuid}: ${e.message}`);
      }
    }
  }

  // Enviar todos los passwords del desktop a Flutter
  try {
    const passwords = await Password.findAll({
      where: { UserId: globalUser.id },
    });

    const data = passwords.map((p) => {
      let createdAt = null;
      let updatedAt = null;
      try { if (p.createdAt) createdAt = new Date(p.createdAt).toISOString(); } catch (_) {}
      try { if (p.updatedAt) updatedAt = new Date(p.updatedAt).toISOString(); } catch (_) {}
      return {
        uuid: p.uuid,
        title: p.title,
        password: p.password,
        expiration: p.expiration,
        expiration_unit: p.expirationUnit,
        created_at: createdAt,
        updated_at: updatedAt,
 };
 });

    sendToClient({ type: "sync_response", passwords: data });
    logToFile(`WS: sync_response enviado con ${data.length} passwords`);
  } catch (e) {
    logToFile(`WS: error en sync_request: ${e.message}`);
  }
}

/**
 * Flutter creó un password → merge en desktop DB.
 */
async function handlePasswordCreated(pwdData) {
  if (!globalUser || !pwdData) return;

  try {
    const existing = await Password.findOne({
      where: { uuid: pwdData.uuid, UserId: globalUser.id },
    });

    if (!existing) {
      await Password.create({
        uuid: pwdData.uuid,
        title: pwdData.title,
        password: pwdData.password,
        expiration: pwdData.expiration || 0,
        expirationUnit: pwdData.expiration_unit || "never",
        UserId: globalUser.id,
        createdAt: pwdData.created_at ? new Date(pwdData.created_at) : undefined,
        updatedAt: pwdData.updated_at ? new Date(pwdData.updated_at) : undefined,
      });
      logToFile(`WS: password CREATED uuid=${pwdData.uuid}`);
    } else {
      // Ya existe → verificar si el remoto es más reciente
      await mergeIfNewer(existing, pwdData);
    }
  } catch (e) {
    logToFile(`WS: error en password_created: ${e.message}`);
  }
}

/**
 * Flutter actualizó un password → merge en desktop DB.
 */
async function handlePasswordUpdated(pwdData) {
  if (!globalUser || !pwdData) return;

  try {
    const existing = await Password.findOne({
      where: { uuid: pwdData.uuid, UserId: globalUser.id },
    });

    if (existing) {
      await mergeIfNewer(existing, pwdData);
    } else {
      // No existe localmente → crear
      await handlePasswordCreated(pwdData);
    }
  } catch (e) {
    logToFile(`WS: error en password_updated: ${e.message}`);
  }
}

/**
 * Merge: solo actualiza si el remoto es más reciente (updated_at).
 */
async function mergeIfNewer(existing, incoming) {
  const localUpdated = new Date(existing.updatedAt).getTime();
  const remoteUpdated = incoming.updated_at ? new Date(incoming.updated_at).getTime() : 0;

  if (remoteUpdated > localUpdated) {
    await existing.update({
      title: incoming.title,
      password: incoming.password,
      expiration: incoming.expiration || 0,
      expirationUnit: incoming.expiration_unit || "never",
      updatedAt: new Date(incoming.updated_at),
    });
    logToFile(`WS: password UPDATED uuid=${incoming.uuid}`);
  }
}

/**
 * Envía un mensaje a la app Flutter (si está conectada).
 */
function sendToClient(msg) {
  if (flutterClient && flutterClient.readyState === WebSocket.OPEN) {
    flutterClient.send(JSON.stringify(msg));
  }
}

/**
 * Notifica a Flutter que se creó/editó un password en el desktop.
 * Se llama desde PasswordController.create y desde main.js.
 */
async function notifyPasswordCreated(password) {
  sendToClient({
    type: "password_created",
    password: {
      uuid: password.uuid,
      title: password.title,
      password: password.password,
      expiration: password.expiration,
      expiration_unit: password.expirationUnit,
      created_at: password.createdAt ? (() => { try { return new Date(password.createdAt).toISOString(); } catch(_) { return null; } })() : null,
      updated_at: password.updatedAt ? (() => { try { return new Date(password.updatedAt).toISOString(); } catch(_) { return null; } })() : null,
    },
  });
}

/**
 * Retorna el puerto del WS server (para generar el QR).
 */
function getWsPort() {
  return WS_PORT;
}

/**
 * Setter para macAddress (se llama desde getHostname en main.js).
 */
let _macAddress = "";
function setMacAddress(mac) {
  _macAddress = mac;
}
function getMacAddress() {
  return _macAddress;
}

/**
 * Setter para globalUser (se sincroniza con main.js).
 */
let globalUser = null;
function setGlobalUser(user) {
  globalUser = user;
}

module.exports = {
  startWsServer,
  generateQrToken,
  getJwtSecret,
  getWsPort,
  setMacAddress,
  setGlobalUser,
  notifyPasswordCreated,
  sendToClient,
};
