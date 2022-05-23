const express = require('express');

const Responses = require('../utils/Responses')

const router = express.Router();

/* Importando e usando rotas de Administrador */
const routerAdmin = require('./router.admin');

router.use('/admin', routerAdmin);

router.get('*', (req, res) => {
  const helpRoutes = [ 'GET/admin/login' ]

  return Responses.notFound(res, [], {helpRoutes}, 'Rota não encontrada!')
})

module.exports = router;
