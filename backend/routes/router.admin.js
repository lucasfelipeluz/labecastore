const express = require('express');
const multer = require('multer')

const uploadConfig = require('../config/upload')

const AdminController = require('../controllers/admin/Admin');
const ProductsController = require('../controllers/admin/ProductsController');
const CategoriesController = require('../controllers/admin/CategoriesController');

const router = express.Router();

const upload = multer(uploadConfig)

router.get('/', AdminController.index);
router.post('/login', AdminController.login)
router.post('/signup', AdminController.newUser)

/* Products */
router.get('/products', ProductsController.index);
router.post('/products', ProductsController.create);
router.put('/products/:id', ProductsController.update);
router.put('/products/dataImage/:id', ProductsController.updateImg)
router.delete('/products/:id', ProductsController.delete);
router.get('/products/images', ProductsController.list)
router.post('/products/upload', upload.array('photos', 5), ProductsController.upload);
router.delete('/products/images/:id', ProductsController.deleteImg);
router.put('/products/images/:id', ProductsController.updateImg);

/* Categories */
router.get('/categories', CategoriesController.index);
router.post('/categories', CategoriesController.create);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete); 

module.exports = router;
