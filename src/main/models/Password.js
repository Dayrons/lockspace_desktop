const { DataTypes } =require('sequelize');
const {sequelize} =require('../config/db');
const { create } = require('html-pdf');




const Password = sequelize.define('tbl_password',{   

  idExternal:{
    type: DataTypes.INTEGER,
    allowNull: true,

 },
    title:{
       type: DataTypes.CHAR,
       allowNull: false,

    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
        
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    
  }, );




module.exports = {Password}