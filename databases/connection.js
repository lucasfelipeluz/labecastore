const Sequelize = require('sequelize');

const connection = new Sequelize('labeca', 'root', 'lucas2012', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;
