const slugify = require('slugify');
const Categories = require('../../models/Categories');

class CategoriesController {
  async index(req, res) {
    const categories = await Categories.findAll();

    if (!categories) {
      res.status(500);
      res.json({
        data: [],
        erro: 'Internal Server Error',
      });
      return;
    }

    res.status(200);
    res.json({
      data: categories,
    });
  }

  async create(req, res) {
    const { title } = req.body;

    if (title === undefined || title === '' || title === null) {
      res.status(400);
      res.json({ erro: 'Título da categoria inválida' });
      return;
    }

    const data = {
      title,
      slug: slugify(title).toLowerCase(),
    };
    const response = await Categories.insertData(data);

    if (!response) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
      return;
    }

    res.status(200);
    res.json({
      status: 'Categoria adicionada',
      registro: title,
    });
  }

  async update(req, res) {
    const { title } = req.body;

    const { id } = req.params;

    const data = {
      title,
      slug: slugify(title).toLowerCase(),
    };

    const response = await Categories.updateData(id, data);

    if (response.status === false) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
    }

    if (response.status === 404) {
      res.status(404);
      res.json({
        error: 'Categoria não encontrada',
      });
      return;
    }

    res.status(200);
    res.json({
      status: 'Categoria editada',
      registro: title,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = await Categories.deleteData(id);

    if (response.status === 404) {
      res.status(404);
      res.json({
        error: 'Categoria não encontrada',
      });
      return;
    }

    if (response.status === false) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
    }

    res.status(200);
    res.json({
      status: 'Categoria apagada.',
    });
  }
}

module.exports = new CategoriesController();
