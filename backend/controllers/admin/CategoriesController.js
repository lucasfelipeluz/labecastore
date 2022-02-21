const slugify = require('slugify');
const Categories = require('../../models/admin/Categories');
const Responses = require('../../utils/Responses')

/* Classe responsável pelo serviços da rota admin/categories */
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
    const { name } = req.body;

    if (name === undefined || name === '' || name === null) {
      Responses.customNotAcceptable(res, 'O nome da categoria é obrigatório.')
      return;
    }

    const data = {
      name,
      slug: slugify(name).toLowerCase(),
    };

    const response = await Categories.insertData(data);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    Responses.internalServerError(res)
  }

  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;

    if (name === undefined || name === '' || name === null) {
      Responses.customNotAcceptable(res, 'O nome da categoria é obrigatório.')
      return;
    }

    const data = {
      name,
      slug: slugify(name).toLowerCase(),
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

}

module.exports = new CategoriesController();
