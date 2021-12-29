const slugify = require('slugify');
const Categories = require('../../models/Categories');
const Responses = require('../../utils/Responses')

/* Classe responsável pelo servições da rota admin/categories */
class CategoriesController {
  async index(req, res) {
    const response = await Categories.findAll()

    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    Responses.internalServerError(res)
  }

  async create(req, res) {
    const { title } = req.body;

    if (title === undefined || title === '' || title === null) {
      Responses.customNotAcceptable(res, 'O nome da categoria é obrigatório.')
      return;
    }

    const data = {
      title,
      slug: slugify(title).toLowerCase(),
    };

    const response = await Categories.insertData(data);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    Responses.internalServerError(res)
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = await Categories.deleteData(id);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }

    if (response.status === null) {
      Responses.customUnauthenticated(res, 'Categoria não encontrada')
      return
    }

    Responses.internalServerError(res)
  }

  async update(req, res) {
    const { title } = req.body;

    const { id } = req.params;

    const data = {
      title,
      slug: slugify(title).toLowerCase(),
    };

    const response = await Categories.updateData(id, data);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }

    if (response.status === null) {
      Responses.customUnauthenticated(res, 'Categoria não encontrada')
      return
    }

    Responses.internalServerError(res)
  }
}

module.exports = new CategoriesController();
