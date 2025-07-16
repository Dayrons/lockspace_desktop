const { sequelize } = require('./config/db');
const{mainWindow}=require('./main')
const{app}=require('electron')

// init()
require('electron-reload')(__dirname + '/..');
app.whenReady().then(mainWindow)


async function init(){
    // Con sqlite esto borra las relacciones
    await sequelize.sync({ alter: true,force:true});
}