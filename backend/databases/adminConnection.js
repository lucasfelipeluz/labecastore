/*  Método responsável por conectar ao Banco de dados
    MySQL. */
const adminConnection = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'lucas2012',
    database: 'labeca',
  },
});

module.exports = adminConnection;
