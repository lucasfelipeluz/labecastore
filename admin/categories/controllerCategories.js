const express = require('express');
const slugify = require('slugify');
const Category = require('./categories');

const router = express.Router();

/* Página Todas Categorias */
router.get('/categories', (req, res) => {
  const nameOfPage = 'Administração de Categorias';
  Category.findAll({
    order: [['id', 'ASC']],
    raw: true,
  }).then(categories => {
    res.render('admin/categories/index', {
      pageName: nameOfPage,
      category: categories,
    });
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

/* Página Editar Categoria */
router.get('/categories/edit/:id', ({ params }, res) => {
  const { id } = params;
  const nameOfPage = 'Editar Categoria';
  Category.findByPk(id).then(category => {
    if (category !== undefined) {
      res.render('admin/categories/edit', {
        pageName: nameOfPage,
        categories: category,
      });
    }
  });
});

/* Editar Categoria */
router.post('/categories/update', (req, res) => {
  const idCategory = req.body.id;
  const titleCategory = req.body.title;
  Category.update({
    title: titleCategory,
    slug: slugify(titleCategory.toLowerCase()),
  }, {
    where: {
      id: idCategory,
    },
  }).then(() => {
    res.redirect('/admin/categories');
  });
});

/* Deletar categoria */
router.post('/categories/delete', (req, res) => {
  const { id } = req.body;
  if (id !== undefined || null) {
    if (!Number.isNaN(id)) {
      Category.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.redirect('/admin/categories');
      });
    }
  }
});

module.exports = router;
