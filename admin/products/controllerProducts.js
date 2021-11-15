const express = require('express');
const Products = require('./products');
const Category = require('../categories/categories');
const Material = require('../materialtype/materialType');

const router = express.Router();

router.get('/products', (req, res) => {
  const pageName = 'Produtos';
  Products.findAll({
    include: [{ model: Category, required: true }],
    order: [['id', 'ASC']],
    raw: true,
  }).then(products => {
    res.render('admin/products/index', {
      pageName,
      products,
    });
  });
});

router.get('/products/new', (req, res) => {
  const pageName = 'Cadastrar Produtos';
  Category.findAll().then(categories => {
    Material.findAll().then(materials => {
      res.render('admin/products/new', {

        pageName,
        categories,
        materials,

      });
    });
  });
});

module.exports = router;
