const Sequelize = require('sequelize');
const connection = require('../../databases/connection');

const materialType = connection.define('materialtype', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

materialType.sync({ force: false });

module.exports = materialType;
