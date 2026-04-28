const { Sequelize } = require('sequelize');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// En desarrollo usamos la ruta del .env si existe, 
// en producción (o si no hay .env) usamos la carpeta de datos de la app
const isDev = !app.isPackaged;
const dbPath = (isDev && process.env.DB_STORAGE) 
    ? process.env.DB_STORAGE 
    : path.join(app.getPath('userData'), 'lockspace.db');

// Asegurar que el directorio existe
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    define: {
        freezeTableName: true
    }
});

module.exports = { sequelize }
