const { BrowserWindow, ipcMain, dialog, Menu } = require('electron')

const path = require('path');

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


    
    window.loadFile(path.join(__dirname,'../','../','dist','index.html'))
}




module.exports = {
    mainWindow
}