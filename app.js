const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('src'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(8080, (erro) => {
  if (erro) console.log('Ocorreu um erro ao conectar o server');
});
