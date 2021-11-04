const express = require('express');
const slugify = require('slugify');
const Category = require('./categories');

const router = express.Router();

/* Página Todas Categorias */
router.get('/categories', (req, res) => {
  const nameOfPage = 'Administração de Categorias';
  res.render('admin/categories/index', {
    pageName: nameOfPage,
  });
});

/* Página Nova Categoria */
router.get('/categories/new', (req, res) => {
  const nameOfPage = 'Criar Nova Categoria';
  res.render('admin/categories/new', {
    pageName: nameOfPage,
  });
});

/* Salvar Categoria */
router.post('/categories/save', (req, res) => {
  const titleCategory = req.body.title;
  if (titleCategory !== undefined) {
    Category.create({
      title: titleCategory,
      slug: slugify(titleCategory.toLowerCase()),
    }).then(() => {
      res.redirect('/admin/categories');
    });
  }
});

module.exports = router;
