const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Log = sequelize.define(
  "Log", // Model name
  {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = Log;
