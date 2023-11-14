const { BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const { networkInterfaces } = require('os');
const path = require('path');
const FtpSrv = require('ftp-srv');
let window


function mainWindow() {

    window = new BrowserWindow({

        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }

    })

    window.loadFile(path.join(__dirname, '../', '../', 'dist', 'index.html'))
}


ipcMain.handle('get-hostname', getHostname)

function getHostname(e, _) {
    const nets = networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {

            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    initFtpServer()
    return results
}

function initFtpServer() {
    const port=2121
    
    const ftpServer = new FtpSrv({
        url: "ftp://0.0.0.0:" + port,
        pasv_url: '127.0.0.1',
        pasv_min: 8881,
        whitelist: ['STOR', 'USER', 'PASS', 'TYPE', 'RETR', 'PASV', 'QUIT'],
        anonymous: true,

    });

    ftpServer.on('login', ({ connection, username, password }, resolve, reject) => { 
        if(username === 'user' && password === 'password'){
            return resolve({ root:'/home/user/Documentos/' });
           
        }
        return reject(new errors.GeneralError('Invalid username or password', 401));
    });

    ftpServer.listen().then(() => { 
        console.log('Ftp server is starting...')
    });
   
}


module.exports = {
    mainWindow
}