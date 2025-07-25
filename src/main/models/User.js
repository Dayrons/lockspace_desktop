const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { Password } = require("./Password");

const User = sequelize.define(
  "User",
  {
    uuid:{
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
      
    },
      externalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Password);
Password.belongsTo(User);

module.exports = { User };
