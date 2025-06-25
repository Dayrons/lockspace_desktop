const { DataTypes } =require('sequelize');
const {sequelize} =require('../config/db')




const User = sequelize.define('tbl_users',{   
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




module.exports = {User}