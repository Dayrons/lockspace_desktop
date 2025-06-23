const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { create } = require("html-pdf");
const { User } = require("./User");

const Password = sequelize.define("tbl_password", {
  externalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

Password.belongsTo(User);

User.hasMany(Password);

module.exports = { Password };
