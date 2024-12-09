const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cuisine: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false
    },  
    validated: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Restaurant;
