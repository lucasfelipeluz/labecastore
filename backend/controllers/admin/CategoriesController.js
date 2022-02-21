const slugify = require('slugify');
const Categories = require('../../models/admin/Categories');
const Responses = require('../../utils/Responses')

/* Classe responsável pelo serviços da rota admin/categories */
class CategoriesController {
  async index(req, res) {
    const responseFindAllCategories = await Categories.findAll()
    if (responseFindAllCategories.status) {
      Responses.success(res, responseFindAllCategories.data)
      return
    }
    Responses.internalServerError(res)
  }

  async create(req, res) {
    const { id, name } = req.body;

    if (name === undefined || name === '' || name === null) {
      Responses.customNotAcceptable(res, 'O nome da categoria é obrigatório.')
      return;
    }

    const data = {
      id,
      name,
      slug: slugify(name).toLowerCase(),
    };

    const responseCreateCategory = await Categories.insertData(data);

    if (responseCreateCategory.status) {
      Responses.success(res, responseCreateCategory.data)
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

    const responseUpdateData = await Categories.updateData(id, data);

    if (responseUpdateData.status) {
      Responses.success(res, responseUpdateData.data)
      return
    }

    if (responseUpdateData.status === null) {
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
