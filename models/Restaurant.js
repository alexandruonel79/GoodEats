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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: { // Add foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Sequelize automatically pluralizes the model name
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
User.hasMany(Restaurant, { foreignKey: "userId", as: "restaurants" });
Restaurant.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Restaurant;
