const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/* Conectando com MongoDB */
mongoose.connect('mongodb://localhost:27017/labeca')

/* Importando e usando rotas de Administrador */
const routerAdmin = require('./router.admin');
router.use('/admin', routerAdmin);

module.exports = router;
