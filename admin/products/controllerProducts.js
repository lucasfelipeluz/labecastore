const express = require('express');
const Products = require('./products');
const Category = require('../categories/categories');

const router = express.Router();

router.get('/products', (req, res) => {
  const pageName = 'Produtos';
  Products.findAll({
    include: [{ model: Category, required: true }],
    /* order: [['id', 'ASC']],
    raw: true, */
  }).then(products => {
    /* console.log(products.Category); */
    res.render('admin/products/index', {
      pageName,
      products,
    });
  });
});

module.exports = router;
