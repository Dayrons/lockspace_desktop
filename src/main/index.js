const{mainWindow}=require('./main')
const{app}=require('electron')


require('electron-reload')(__dirname + '/..');


app.whenReady().then(mainWindow) 