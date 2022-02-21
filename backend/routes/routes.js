const express = require('express');

const router = express.Router();

/* Importando e usando rotas de Administrador */
const routerAdmin = require('./router.admin');

router.use('/admin', routerAdmin);

module.exports = router;
