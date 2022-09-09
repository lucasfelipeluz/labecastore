const express = require('express');

/* Importando Controllers */
const UsersController = require('../controllers/UsersController');
const ProductsController = require('../controllers/admin/ProductsController');
const CategoriesController = require('../controllers/admin/CategoriesController');
const ImagesController = require('../controllers/admin/ImagesController');
const AWSController = require('../controllers/admin/AWSController');

const AdminAuth = require('../middleware/AdminAuth');

const router = express.Router();

// Login Admin
router.post('/login', UsersController.login);
router.post('/create', UsersController.create);
router.post('/checkuser', UsersController.checkUser);
router.put('/changepassword', AdminAuth, UsersController.update);
router.put('/authorize', AdminAuth, UsersController.authorizeUser);
router.delete('/delete', AdminAuth, UsersController.remove);

/*  Products
    Precisa de credenciais de Administrador */
router.get('/products', AdminAuth, ProductsController.index);
router.get('/products/:id', AdminAuth, ProductsController.getById);
router.post('/products', AdminAuth, ProductsController.create);
router.put('/products/:id', AdminAuth, ProductsController.update);
router.delete('/products/:id', AdminAuth, ProductsController.delete);

/*  Categories
    Precisa de credenciais de Administrador */
router.get('/categories', AdminAuth, CategoriesController.index);
router.post('/categories', AdminAuth, CategoriesController.create);
router.put('/categories/:id', AdminAuth, CategoriesController.update);
router.delete('/categories/:id', AdminAuth, CategoriesController.delete);

/*  Images
    Precisa de crendeciais de Administrador */
router.get('/images', AdminAuth, ImagesController.index);
router.post('/images', AdminAuth, ImagesController.create);
router.delete('/images/:id', AdminAuth, ImagesController.delete);

/* AWS
   Precisa de crendeciais de Administrador */
router.get('/aws', AdminAuth, AWSController.getAll);
router.get('/aws/:filename', AdminAuth, AWSController.getBase64);
router.post('/aws', AdminAuth, AWSController.create);
router.delete('/aws/:filename', AdminAuth, AWSController.delete);

module.exports = router;
