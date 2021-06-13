require("dotenv").config();

module.exports = {
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASS,
};
