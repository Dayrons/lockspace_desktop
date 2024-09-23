const { DataTypes } =require('sequelize');
const {sequelize} =require('../config/db')




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
    
  }, );




module.exports = {Password}