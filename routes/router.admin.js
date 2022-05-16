const express = require('express');
const multer = require('multer')

/* Importando Configurações do Upload */
const uploadConfig = require('../config/upload')

/* Importando Controllers */
const AdminController = require('../controllers/admin/AdminController');
const ProductsController = require('../controllers/admin/ProductsController');
const CategoriesController = require('../controllers/admin/CategoriesController');
const ImagesController = require('../controllers/admin/ImagesController')

const router = express.Router();

/* Configurando e usando o Multer */
const upload = multer(uploadConfig)

/*  Login e inscrição
    Não precisam de credencias de Administrador */
router.post('/login', AdminController.login)

/* Página Inicial de Administrador */
router.get('/', AdminController.index);

/*  Products
    Precisa de credenciais de Administrador */
router.get('/products', ProductsController.index);
router.get('/products/details/:id', ProductsController.details);
router.post('/products', ProductsController.create);
router.put('/products/:id', ProductsController.update);
router.delete('/products/:id', ProductsController.delete);

/*  Categories
    Precisa de credenciais de Administrador */
router.get('/categories', CategoriesController.index);
router.post('/categories', CategoriesController.create);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.delete); 

/*  Images
    Precisa de crendeciais de Administrador */
router.get('/images', ImagesController.index)
router.post('/images', upload.array('photos', 1), ImagesController.create)
router.delete('/images/:id', ImagesController.delete)

router.get('/dev', (req, res) => {
    res.json({
        aws: {
            aws_access_key_id: process.env.aws_access_key_id,
            aws_secret_access_key: process.env.aws_secret_access_key,
            aws_bucket_name: process.env.aws_bucket_name,
            aws_region: process.env.aws_region,
        }, 
        db:{
            db_host: process.env.db_host,
            db_user: process.env.db_user,
            db_password: process.env.db_password,
            db_database: process.env.db_database,
        }
    })
})

module.exports = router;
