const express = require('express');
const materialType = require('./materialType');

const router = express.Router();

/* Página Principal */
router.get('/material', (req, res) => {
  const pageName = 'Tipos de Matériais';
  materialType.findAll({
    order: [['id', 'ASC']],
    raw: true,
  }).then(materials => {
    res.render('admin/materialtype/index', {
      pageName,
      materials,
    });
  });
});

/* Página de novo material */
router.get('/material/new', (req, res) => {
  const pageName = 'Criar Novo Matérial';
  res.render('admin/materialtype/new', {
    pageName,
  });
});

/* Adicionar Material */
router.post('/material/save', (req, res) => {
  const { title } = req.body;
  materialType.create({
    title,
  }).then(() => {
    res.redirect('/admin/material');
  }).catch(err => console.log(err));
});

/* Página editar */
router.get('/material/edit/:id', (req, res) => {
  const pageName = 'Editar Material';
  const { id } = req.params;
  materialType.findByPk(id).then(materials => {
    if (materials !== undefined) {
      res.render('admin/materialtype/edit', {
        pageName,
        materials,
      });
    }
  });
});

router.post('/material/update', (req, res) => {
  const { id, title } = req.body;
  materialType.update({
    title,
  }, {
    where: {
      id,
    },
  }).then(() => {
    res.redirect('/admin/material');
  });
});

router.post('/material/delete', (req, res) => {
  const { id } = req.body;
  if (id !== undefined || null) {
    if (!Number.isNaN(id)) {
      materialType.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.redirect('/admin/material');
      });
    }
  }
});

module.exports = router;
