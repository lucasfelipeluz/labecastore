/* Importando credencias da AWS S3 */
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
app.listen(80, (erro) => {
  if (erro) console.log(`Ocorreu um erro ao conectar o server: \n${erro}`);
  else console.log('Servidor rodando!')
});
