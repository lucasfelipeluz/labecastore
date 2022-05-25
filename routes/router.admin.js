const express = require('express');
const multer = require('multer')

/* Importando Configurações do Upload */
const uploadConfig = require('../config/upload')

/* Importando Controllers */
const AdminController = require('../controllers/admin/AdminController');
const ProductsController = require('../controllers/admin/ProductsController');
const CategoriesController = require('../controllers/admin/CategoriesController');
const ImagesController = require('../controllers/admin/ImagesController');

const AdminAuth = require('../middleware/AdminAuth')

const router = express.Router();

/* Configurando e usando o Multer */
const upload = multer(uploadConfig)

// Login Admin
router.post('/login', AdminController.login)
router.post('/create', AdminAuth, AdminController.create)
router.put('/changepassword', AdminAuth, AdminController.update)
router.delete('/delete', AdminAuth, AdminController.remove)

/*  Products
    Precisa de credenciais de Administrador */
router.get('/products', AdminAuth, ProductsController.index);
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
router.get('/images', AdminAuth, ImagesController.index)
router.post('/images', AdminAuth, upload.array('photos', 5), ImagesController.create)
router.delete('/images/:id', AdminAuth, ImagesController.delete)

module.exports = router;
