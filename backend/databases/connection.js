/*  Método responsável por conectar ao Banco de dados
    MySQL. */
const database = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'lucas2012',
    database: 'labeca',
  },
});

module.exports = database;
