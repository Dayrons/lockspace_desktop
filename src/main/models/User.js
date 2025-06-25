const { DataTypes } =require('sequelize');
const {sequelize} =require('../config/db');
const { Password } = require('./Password');




const User = sequelize.define('User',{   
    name:{
       type: DataTypes.CHAR,
       allowNull: false,

    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    

  },{
    timestamps: true
} );

User.hasMany(Password);
Password.belongsTo(User);



module.exports = {User}