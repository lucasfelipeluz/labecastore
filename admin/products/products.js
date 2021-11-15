const Sequelize = require('sequelize');
const connection = require('../../databases/connection');
const Categories = require('../categories/categories');
const materialType = require('../materialtype/materialType');

const Products = connection.define('products', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  inventoryP: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inventoryM: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inventoryG: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  inventoryEG: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Categories.hasMany(Products);
Products.belongsTo(Categories);
materialType.hasMany(Products);
Products.belongsTo(materialType);

module.exports = Products;
