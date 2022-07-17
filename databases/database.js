require("dotenv").config();
const Sequelize = require("sequelize");

class Database {
  getConnectionOptions() {
    return new Sequelize(
      process.env.db_database,
      process.env.db_user,
      process.env.db_password,
      { host: process.env.db_host, dialect: "mysql" }
    );
  }
}

module.exports = new Database();
