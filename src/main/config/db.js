const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // storage: path.join(__dirname, '../','data', 'data.db'),
    storage: process.env.DB_STORAGE,
    // logging: false,
    // define: {
    //     freezeTableName: true
    // }
});

// const sequelize = new Sequelize("lockspace", "postgres","1234", {
//   host: 'localhost',
//   dialect: 'postgres',
//   logging:false,
//   define: {
//     freezeTableName: true
//   }
// });
    
    
    




module.exports = {sequelize}