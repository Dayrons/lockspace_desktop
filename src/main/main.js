const { BrowserWindow, ipcMain, dialog, Menu } = require("electron");

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
const bcrypt = require("bcrypt");
let window;

let dataResponse;
let globalUser;

let macAddress;

const uuid = "password";

const root = path.join(__dirname, "../../");
function mainWindow() {
  window = new BrowserWindow({
    width: false,
    height: false,
    resizable: false,
    // frame: false,
    titleBarStyle: "hidden",

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
ipcMain.handle("signup", AuthController.signup);

// ipcMain.handle('start-server', initFtpServer)

ipcMain.handle("delete-password", PasswordController.delete);
ipcMain.handle("create-password", PasswordController.create);
ipcMain.handle("get-password", PasswordController.get);
ipcMain.handle("search-password", PasswordController.search);

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

async function registerPassword(e, values) {
  const validatePassword = await bcrypt.compare(
    values.password,
    globalUser.password
  );

  if (validatePassword) {
    let buffer = Buffer.from(dataResponse.uuid, "utf8");

    let uuid = buffer.toString("base64");

    let passwords = dataResponse.passwords;

    let secret = new fernet.Secret(uuid);

    const newPasswords = [];
    for (let i = 0; i < passwords.length; i++) {
      const password = passwords[i];

      const decryptedPassword = new fernet.Token({
        secret: secret,
        token: password.password,
        ttl: 0,
      });

      password.password = decryptedPassword.decode();

      const hardwareId = await machineId();

      const hash = crypto.createHash("sha256");
      hash.update(hardwareId);
      const derivedKeyBytes = hash.digest(); // Esto es un Buffer de 32 bytes

      const fernetKeyBase64 = derivedKeyBytes.toString("base64"); // 'base64url' es ideal

      secret = new fernet.Secret(fernetKeyBase64);

      const token = new fernet.Token({ secret: secret });

      password.password = token.encode(password.password);

      password.UserId = globalUser.id;

      password.externalId = password.id;

      const { id, ...newPassword } = password;
      newPasswords.push(newPassword);
    }

    await Password.bulkCreate(newPasswords, { ignoreDuplicates: true });

    return JSON.stringify({
      error: false,
      message: "Registrado correctamente",
      data: globalUser,
    });
  }

  return JSON.stringify({
    error: true,
    message: "Contraseña invalida",
  });
}

async function getFile(e, _) {
  const file = path.join(root, "data.txt");
  const exist = fs.existsSync(file);

  if (exist) {
    const data = fs.readFileSync(file, "utf-8");
    fs.unlinkSync(file);

    dataResponse = JSON.parse(data);

    const [user, _] = await User.findOrCreate({
      where: { externalId: dataResponse.user.id },
      defaults: {
        name: dataResponse.user.name.toLowerCase(),
        password: dataResponse.user.password,
        externalId :dataResponse.user.id 
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
}

module.exports = {
  mainWindow,
};
