const express = require('express');

const Responses = require('../utils/Responses')

const router = express.Router();

// Importando e usando rotas
const routerAdmin = require('./router.admin');
const routerPublic = require('./router.public')

router.use('/admin', routerAdmin);
router.use('/', routerPublic)

// Caso não encontre nenhuma rota, retornará NotFound
router.get('*', (req, res) => {
  const helpRoutes = [ 'GET/admin/login', 'GET/products', 'GET/categories' ]

  return Responses.notFound(res, [], {helpRoutes}, 'Rota não encontrada!')
})

module.exports = router;
