const { BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const { networkInterfaces } = require('os');
const path = require('path');
const spawn = require('child_process').spawn
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
   
    const pythonProcess = spawn('python', ['./server.py'])
    let pythonResponse = ""


    pythonProcess.stdout.on('data', function (data) {
        // console.log(data.toString())
        pythonResponse += data.toString()
    })
    pythonProcess.stdout.on('end', function () {
        // console.log(pythonResponse)
    })


    pythonProcess.stdin.write('backendi')

    pythonProcess.stdin.end()
}


module.exports = {
    mainWindow
}