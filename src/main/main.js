const { BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage, app } = require("electron");

const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const PasswordController = require("./controllers/PasswordController");
const AuthController = require("./controllers/AuthController");
const fernet = require("fernet");
const { Password } = require("./models/Password");
const { User } = require("./models/User");
const wsServer = require("./wsServer");
let window;
let tray;

let dataResponse;
let globalUser;

let macAddress;

const uuid = "password";

const root = app.getPath("userData");

function logToFile(message) {
  const logDir = app.getPath("userData");
  const logFile = path.join(logDir, "app.log");
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(logFile, formattedMessage);
}

function createTray() {
  try {
    const iconPath = path.join(__dirname, "../assets/logo.png");
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Mostrar App",
        click: () => {
          window.show();
        },
      },
      {
        label: "Salir",
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.setToolTip("Lockspace Desktop");
    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      if (window.isVisible()) {
        window.hide();
      } else {
        window.show();
      }
    });
  } catch (error) {
    logToFile(`Error creating tray: ${error.message}`);
  }
}

function mainWindow() {
  window = new BrowserWindow({
    width: 1000,
    height: 700,
    // resizable: false,
    // frame: false,
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "../assets/logo.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "../", "../", "dist", "index.html"));

  window.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      window.hide();
    }
    return false;
  });
}

// const mainMenu = Menu.buildFromTemplate([]);
// // Set The Menu to the Main Window
// Menu.setApplicationMenu(mainMenu);

ipcMain.handle("get-hostname", getHostname);

ipcMain.handle("singin", AuthController.singin);
ipcMain.handle("signup", AuthController.signup);

// ipcMain.handle('start-server', initFtpServer)

ipcMain.handle("delete-password", PasswordController.delete);
ipcMain.handle("create-password", async (e, values) => {
  const result = await PasswordController.create(e, values);
  // Notificar a Flutter via WebSocket si está conectado
  try {
    const res = JSON.parse(result);
    if (!res.error && res.data) {
      wsServer.notifyPasswordCreated(res.data);
    }
  } catch (_) {}
  return result;
});
ipcMain.handle("get-password", PasswordController.get);
ipcMain.handle("search-password", PasswordController.search);
ipcMain.handle("decrypt-password", PasswordController.decryptPassword);

ipcMain.on("start-server", startServer);

ipcMain.handle("get-file", getFile);

ipcMain.handle("validate-file-password", registerPassword);

function getHostname(e, _) {
  const nets = networkInterfaces();
  let ip;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        ip = net.address;
        macAddress = net.mac;
      }
    }
  }

  // Guardar macAddress en wsServer para auth
  wsServer.setMacAddress(macAddress);

  // Generar JWT con info del WS server (no FTP)
  const token = wsServer.generateQrToken(ip);
  return token;
}

function startServer(e, _) {
  // Iniciar WebSocket server en vez de FTP
  wsServer.startWsServer(window, logToFile, (user) => {
    // Cuando Flutter se autentica por WS, actualizar globalUser en main.js
    globalUser = user;
    wsServer.setGlobalUser(user);
    logToFile(`main.js: globalUser sincronizado desde WS: ${user.name}`);
  });
}

async function registerPassword(e, values) {
  try {
    logToFile(`registerPassword called with password length: ${values.password?.length}`);
    logToFile(`globalUser: ${globalUser?.name}, stored hash: ${globalUser?.password?.substring(0, 30)}...`);
    
    // Verificar contraseña con HMAC-SHA256 (compatible con Flutter)
    const computedHash = AuthController.hashPassword(values.password, globalUser.name);
    logToFile(`computedHash: ${computedHash.substring(0, 30)}...`);
    
    const validatePassword = (computedHash === globalUser.password);
    logToFile(`validatePassword: ${validatePassword}`);

    if (validatePassword) {
      // Con WebSocket, los passwords del Flutter ya se procesaron en handleSyncRequest.
      // Aquí solo validamos la contraseña y confirmamos éxito.
      // Enviar todos los passwords del desktop al Flutter via WS para que sincronice
      const passwords = await Password.findAll({
        where: { UserId: globalUser.id },
      });
      const data = passwords.map((p) => {
        let createdAt = null;
        let updatedAt = null;
        try {
          if (p.createdAt) createdAt = new Date(p.createdAt).toISOString();
        } catch (_) {}
        try {
          if (p.updatedAt) updatedAt = new Date(p.updatedAt).toISOString();
        } catch (_) {}
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
      wsServer.sendToClient({ type: "sync_response", passwords: data });
      logToFile(`registerPassword: enviados ${data.length} passwords al Flutter via WS`);

      // Notificar al renderer para refrescar la lista
      window.webContents.send("sync-completed", { created: 0, updated: 0 });

      return JSON.stringify({
        error: false,
        message: "Sincronización completada correctamente",
        data: globalUser,
      });
    }

    return JSON.stringify({
      error: true,
      message: "Contraseña de acceso inválida",
    });
  } catch (error) {
    logToFile(`registerPassword error: ${error.message}\nStack: ${error.stack}`);
    return JSON.stringify({ error: true, message: "Error interno" });
  }
}

/**
 * Escribe sync_down.json con todos los passwords del usuario actual.
 * Flutter descargará este archivo para aplicar merge en su DB local.
 */
async function writeSyncDown() {
  if (!globalUser) return;
  try {
    const passwords = await Password.findAll({
      where: { UserId: globalUser.id },
    });

    // Formato compatible con Flutter (snake_case)
    const data = passwords.map((p) => ({
      uuid: p.uuid,
      title: p.title,
      password: p.password, // encriptada con Fernet, tal cual
      expiration: p.expiration,
      expiration_unit: p.expirationUnit,
      created_at: p.createdAt ? p.createdAt.toISOString() : null,
      updated_at: p.updatedAt ? p.updatedAt.toISOString() : null,
    }));

    const filePath = path.join(root, "sync_down.json");
    fs.writeFileSync(filePath, JSON.stringify(data));
    logToFile(`sync_down.json written with ${data.length} passwords`);
  } catch (error) {
    logToFile(`writeSyncDown error: ${error.message}`);
  }
}

/**
 * Procesa data.txt del FTP automáticamente (sync periódico).
 * Aplica merge bidireccional sin pedir contraseña (ya hay globalUser).
 * Luego escribe sync_down.json para que Flutter lo descargue.
 */
async function processSyncFile() {
  try {
    const file = path.join(root, "data.txt");
    if (!fs.existsSync(file)) return;

    const data = fs.readFileSync(file, "utf-8");
    fs.unlinkSync(file); // Limpiar archivo
    dataResponse = JSON.parse(data);

    // Asegurar que el usuario existe localmente
    const [user, _] = await User.findOrCreate({
      where: { uuid: dataResponse.user.uuid },
      defaults: {
        name: dataResponse.user.name.toLowerCase(),
        password: dataResponse.user.password,
        uuid: dataResponse.user.uuid,
      },
    });
    globalUser = user;
    wsServer.setGlobalUser(user);

    // Aplicar merge (misma lógica que registerPassword pero sin verificar contraseña)
    const incomingPasswords = dataResponse.passwords;
    const results = { created: 0, updated: 0, skipped: 0 };

    for (const incoming of incomingPasswords) {
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
          results.created++;
        } else {
          const localUpdated = new Date(existing.updatedAt).getTime();
          const remoteUpdated = incoming.updated_at
            ? new Date(incoming.updated_at).getTime()
            : 0;

          if (remoteUpdated > localUpdated) {
            await existing.update({
              title: incoming.title,
              password: incoming.password,
              expiration: incoming.expiration || 0,
              expirationUnit: incoming.expiration_unit || "never",
              updatedAt: new Date(incoming.updated_at),
            });
            results.updated++;
          } else {
            results.skipped++;
          }
        }
      } catch (error) {
        logToFile(`processSyncFile: error merging uuid=${incoming.uuid}: ${error.message}`);
      }
    }

    // Escribir sync_down.json
    await writeSyncDown();

    // Notificar al renderer que hubo cambios (para refrescar la lista)
    if (results.created > 0 || results.updated > 0) {
      window.webContents.send("sync-completed", results);
    }

    logToFile(`processSyncFile: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`);
  } catch (error) {
    logToFile(`processSyncFile error: ${error.message}`);
  }
}

async function getFile(e, _) {
  try {
    const file = path.join(root, "data.txt");
    logToFile(`Searching for synchronization file at: ${file}`);
    const exist = fs.existsSync(file);

    if (exist) {
      logToFile("Synchronization file found, processing...");
      const data = fs.readFileSync(file, "utf-8");
      fs.unlinkSync(file);

      dataResponse = JSON.parse(data);
      const [user, _] = await User.findOrCreate({
        where: { uuid: dataResponse.user.uuid },
        defaults: {
          name: dataResponse.user.name.toLowerCase(),
          password: dataResponse.user.password,
          uuid: dataResponse.user.uuid,
        },
      });

      globalUser = user;
      wsServer.setGlobalUser(user);
      window.webContents.send("show-modal-password");

      return {
        error: false,
        message: "File found",
      };
    }

    return {
      error: true,
      message: "No file found",
    };
  } catch (error) {
    logToFile(`getFile error: ${error.message}`);
    return { error: true, message: "Error reading file" };
  }
}

module.exports = {
  mainWindow,
  createTray,
};
