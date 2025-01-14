const { BrowserWindow, ipcMain, dialog, Menu } = require("electron");

const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");
const FtpSrv = require("ftp-srv");
var jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const PasswordController = require("./controllers/PasswordController");
const AuthController = require("./controllers/AuthController");

let window;

let macAddress;

const root = path.join(__dirname, "../../");
function mainWindow() {
  window = new BrowserWindow({
    width: 750,
    height: 400,
    resizable: false,
    // frame: false,
    titleBarStyle: 'hidden',
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });


  window.loadFile(path.join(__dirname, "../", "../", "dist", "index.html"));
}





// const mainMenu = Menu.buildFromTemplate([]);
// // Set The Menu to the Main Window
// Menu.setApplicationMenu(mainMenu);

ipcMain.handle("get-hostname", getHostname);

ipcMain.handle("singin", AuthController.singin);


// ipcMain.handle('start-server', initFtpServer)

ipcMain.handle("register-password", PasswordController.registerPassword);

ipcMain.on("start-server", initFtpServer);

ipcMain.handle("get-file", getFile);

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
    password: "password",
    host: ip,
  };

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

      if (username === macAddress && password === "password") {
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
