const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: "postgres",
  password: "admin",
  database: process.env.DB_NAME,
  logging: false, // Disable logging if not needed
});

module.exports = sequelize;
