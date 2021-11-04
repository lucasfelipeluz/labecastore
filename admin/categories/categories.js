const Sequelize = require('sequelize');
const connection = require('../../databases/connection');

const Categories = connection.define('categories', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Categories.sync({ force: false });

module.exports = Categories;
