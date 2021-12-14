const express = require('express');

const AdminController = require('../controllers/admin/Admin');
const ProductsController = require('../controllers/admin/ProductsController');
const CategoriesController = require('../controllers/admin/CategoriesController');

const router = express.Router();

router.get('/', AdminController.index);

/* Products */
router.get('/products', ProductsController.index);
router.post('/products', ProductsController.create);
router.put('/products/:id', ProductsController.update);
router.delete('/products/:id', ProductsController.delete);

/* Categories */
router.get('/categories', CategoriesController.index);
router.post('/categories', CategoriesController.create);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete); 

module.exports = router;
