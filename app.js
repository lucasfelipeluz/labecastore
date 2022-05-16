/* Importando variáveis de ambiente */
require('dotenv').config()

const express = require('express');
const router = require('./routes/routes');

const app = express();

/* Body Parser */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Usando Rotas */
app.use('/', router);

/* Iniciando Server */
const port = process.env.PORT || 8989;
app.listen(port, erro => {
  if (process.env.server_mode == 'dev'){
    if (erro) console.log('Erro ao iniciar o servidor!')
    else {console.log(`Server running in port: ${port}`)}
  }
});

module.exports = app;