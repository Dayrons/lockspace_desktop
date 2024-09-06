const { BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");
const FtpSrv = require("ftp-srv");
var jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

let window;

const root = path.join(__dirname, "../../");
function mainWindow() {
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "../", "../", "dist", "index.html"));
}

ipcMain.handle("get-hostname", getHostname);

// ipcMain.handle('start-server', initFtpServer)

ipcMain.on("start-server", initFtpServer);

ipcMain.handle("get-file", getFile);

function getHostname(e, _) {
  const nets = networkInterfaces();
  const host = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!host[name]) {
          host[name] = [];
        }
        host[name].push(net.address);
      }
    }
  }

  // la contrase;a con la que se encodea las contrase;a en el movil es con lo que se pasara los datos del usuario encodeado
  const macAddress = networkInterfaces().eno1[0].mac;

  const userEncrypt = CryptoJS.AES.encrypt(macAddress, "1234").toString();

  const data = { username: userEncrypt, password: "password", ip: host.eno1[0] };

  const secretKey = "1234";

  const token = jwt.sign(data, secretKey, { expiresIn: "1h" });

  return token;
}

function initFtpServer(e, _) {
  const port = 2121;

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
        console.log(`FILE ${file}`);
        window.webContents.send("redirect");
      });

      if (username === "user" && password === "password") {
        return resolve({ root: root });
      }
      return reject(
        new errors.GeneralError("Invalid username or password", 401)
      );
    }
  );

  ftpServer.on("client-error", ({ context, error }) => {
    console.error(
      `FTP server error: error interfacing with client ${context} ${error} on ftp://${host}:${port} ${JSON.stringify(
        error
      )}`
    );
  });

  ftpServer.on("disconnect", async ({ connection, id, newConnectionCount }) => {
    console.log("Cliente desconectado");
    await ftpServer.close();
  });

  ftpServer.listen().then(() => {
    console.log("Ftp server is starting...");
  });
}

function getFile(e, _) {
  const file = path.join(root, "password.txt");
  const exist = fs.existsSync(file);

  if (exist) {
    const data = fs.readFileSync(file, "utf-8");
    fs.unlinkSync(file);
    return JSON.parse(data);
  }

  return null;
}

module.exports = {
  mainWindow,
};
