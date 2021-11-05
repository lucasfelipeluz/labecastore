const express = require('express');
const connection = require('./databases/connection');
const admProducts = require('./admin/products/controllerProducts');
const admCategories = require('./admin/categories/controllerCategories');

const app = express();

/* Body Parser */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* View Engine and static files configuration */
app.set('view engine', 'ejs');
app.use(express.static('src'));

/* Connection of databases */
connection.authenticate().then().catch(msgErro => console.log(msgErro));

/* Models admin */
function Admin() {
  app.get('/admin', (req, res) => {
    const nameOfPage = 'Administração La Beca';
    res.render('admin/index', {
      pageName: nameOfPage,
    });
  });
  app.use('/admin', admProducts);
  app.use('/admin', admCategories);
}

/* Homepage */
app.get('/', (req, res) => {
  const nameOfPage = null;
  res.render('index', {
    pageName: nameOfPage,
  });
});

/* Server */
app.listen(80, (erro) => {
  if (erro) console.log(`Ocorreu um erro ao conectar o server: \n${erro}`);
});

Admin();
