const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { create } = require("html-pdf");


const Password = sequelize.define("Password", {
  externalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
   uuid:{
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
  title: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  expiration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expirationUnit: {
    type: DataTypes.CHAR,
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
  
});



module.exports = { Password };
