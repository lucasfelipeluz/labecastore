const express = require('express');
const connection = require('./databases/connection');
const admProducts = require('./admin/products/products');
const admCategories = require('./admin/categories/categories');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('src'));

connection
  .authenticate()
  .then()
  .catch(msgErro => console.log(msgErro));

function Admin() {
  app.use('/admin', admProducts);
  app.use('/admin', admCategories);
}

app.get('/', (req, res) => {
  const nameOfPage = null;
  res.render('index', {
    pageName: nameOfPage,
  });
});

app.listen(80, (erro) => {
  if (erro) console.log(`Ocorreu um erro ao conectar o server: \n${erro}`);
});

Admin();
