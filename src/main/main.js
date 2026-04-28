const { BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage, app } = require("electron");

const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");
const FtpSrv = require("ftp-srv");
var jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const PasswordController = require("./controllers/PasswordController");
const AuthController = require("./controllers/AuthController");
const fernet = require("fernet");
const { Password } = require("./models/Password");
const { User } = require("./models/User");
const { machineId } = require("node-machine-id");
const bcrypt = require("bcryptjs");
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
ipcMain.handle("create-password", PasswordController.create);
ipcMain.handle("get-password", PasswordController.get);
ipcMain.handle("search-password", PasswordController.search);
ipcMain.handle("decrypt-password", PasswordController.decryptPassword);

ipcMain.on("start-server", initFtpServer);

ipcMain.handle("get-file", getFile);

ipcMain.handle("validate-file-password", registerPassword);

function getHostname(e, _) {
  const nets = networkInterfaces();
  const host = Object.create(null);

  let ip;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;

      if (net.family === familyV4Value && !net.internal) {
        if (!host[name]) {
          host[name] = [];
        }

        ip = net.address;
        macAddress = net.mac;

        // host[name].push(net.address);
      }
    }
  }

  // const key = CryptoJS.enc.Utf8.parse("secretkey:hapilyeverafter1234567");

  // // El problema es que el iv es diferente en flutter crea encriptado diferente
  // const iv = CryptoJS.lib.WordArray.random(16);

  // const userEncrypt = CryptoJS.AES.encrypt(macAddress, key, { iv: iv });
  // const decrypted = CryptoJS.AES.decrypt(userEncrypt, key, { iv: iv });

  // console.log(decrypted.toString(CryptoJS.enc.Utf8));
  // console.log(userEncrypt.toString());

  const data = {
    username: macAddress,
    password: uuid,
    host: ip,
  };

  const secretKey = "1234";

  const token = jwt.sign(data, secretKey, { expiresIn: "1h" });

  return token;
}

function initFtpServer(e, _) {
  const port = 2121;
  logToFile("Attempting to start FTP server on port " + port);

  try {
    const ftpServer = new FtpSrv({
      url: "ftp://0.0.0.0:" + port,
      pasv_url: "127.0.0.1",
      pasv_min: 8881,
      whitelist: ["STOR", "USER", "PASS", "TYPE", "RETR", "PASV", "QUIT"],
      anonymous: true,
    });

    ftpServer.on(
      "login",
      ({ connection, username, password }, resolve, reject) => {
        connection.on("STOR", async (error, file) => {
          window.webContents.send("redirect");
        });

        if (username === macAddress && password === uuid) {
          return resolve({ root: root });
        }
        return reject(
          new Error("Invalid username or password")
        );
      }
    );

    ftpServer.on("client-error", ({ context, error }) => {
      const errorMsg = `FTP client error: ${context} ${error.message}`;
      console.error(errorMsg);
      logToFile(errorMsg);
    });

    ftpServer.on("disconnect", async ({ connection, id, newConnectionCount }) => {
      console.log("Cliente desconectado");
      await ftpServer.close();
    });

    ftpServer.listen().then(() => {
      const msg = "Ftp server is starting...";
      console.log(msg);
      logToFile(msg);
    }).catch(err => {
      logToFile(`FTP server listen error: ${err.message}`);
    });
  } catch (error) {
    logToFile(`FTP server setup error: ${error.message}`);
  }
}

async function registerPassword(e, values) {
  try {
    const validatePassword = await bcrypt.compare(
      values.password,
      globalUser.password
    );

    if (validatePassword) {
      // 1. Preparar la clave de la App Móvil (Decodificación)
      // El dispositivo móvil usa el UUID como clave. Al ser un UUID (36 chars),
      // se usan los 32 caracteres resultantes de eliminar los guiones para obtener los 32 bytes que requiere Fernet.
      const keyString = dataResponse.uuid;
      if (!keyString) {
        return JSON.stringify({ error: true, message: "No se encontró el identificador de sincronización" });
      }

      const cleanKey = keyString.replace(/-/g, "");
      const fernetKeyBase64 = Buffer.from(cleanKey).toString("base64");
      const fernetSecret = new fernet.Secret(fernetKeyBase64);

      // 2. Preparar la clave de la App Desktop (Re-encriptación local)
      // Obtenemos el ID de hardware y aplicamos SHA256 para asegurar 32 bytes de clave
      const hardwareId = await machineId();
      const hashHardware = crypto.createHash("sha256");
      hashHardware.update(hardwareId);
      const hardwareSecret = new fernet.Secret(hashHardware.digest().toString("base64"));

      const passwords = dataResponse.passwords;
      const newPasswords = [];

      for (let i = 0; i < passwords.length; i++) {
        const password = passwords[i];
        try {
          // Decodificar el token que viene de la app móvil
          const tokenMobile = new fernet.Token({
            secret: fernetSecret,
            token: password.password,
            ttl: 0,
          });

          const decryptedText = tokenMobile.decode();

          if (decryptedText) {
            // Re-encriptar con la clave local del hardware del PC
            const tokenDesktop = new fernet.Token({ secret: hardwareSecret });
            password.password = tokenDesktop.encode(decryptedText);

            password.UserId = globalUser.id;
            password.externalId = password.id;

            const { id, ...newPassword } = password;
            newPasswords.push(newPassword);
          }
        } catch (error) {
          logToFile(`Error processing password "${password.title}": ${error.message}`);
        }
      }

      if (newPasswords.length > 0) {
        await Password.bulkCreate(newPasswords, { ignoreDuplicates: true });
      }

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
    logToFile(`registerPassword error: ${error.message}`);
    return JSON.stringify({ error: true, message: "Error interno" });
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
          externalId: dataResponse.user.id,
          uuid: dataResponse.user.uuid,
        },
      });

      globalUser = user;
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
