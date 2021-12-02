const express = require('express');

const AdminController = require('../controllers/admin/Admin');
const ProductsController = require('../controllers/admin/Products');
const CategoriesController = require('../controllers/admin/CategoriesController');

const router = express.Router();

router.get('/', AdminController.index);
router.get('/products', ProductsController.index);

/* Categories */
router.get('/categories', CategoriesController.index);
router.post('/categories', CategoriesController.create);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete);

module.exports = router;
