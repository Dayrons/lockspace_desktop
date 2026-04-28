const { sequelize } = require('./config/db');
const { mainWindow, createTray } = require('./main');
const { app } = require('electron');


require('./models/User');
require('./models/Password');

require('electron-reload')(__dirname + '/..');

async function init(){
    try {
        // Verificar si existen tablas en la base de datos
        const tables = await sequelize.getQueryInterface().showAllTables();
        
        if (tables.length === 0) {
            // Solo sincroniza (crea tablas) si no existe ninguna
            await sequelize.sync();
        }
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    }
}

app.whenReady().then(async () => {
    await init();
    mainWindow();
    createTray();
});
