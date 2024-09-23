const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    // storage: path.join(__dirname, '../','data', 'data.db'),
    storage: '/home/dayrons/Documentos/Proyectos/lockspace_desktop/src/main/database.db',
    // logging: false,
    // define: {
    //     freezeTableName: true
    // }
});
    
    




module.exports = {sequelize}