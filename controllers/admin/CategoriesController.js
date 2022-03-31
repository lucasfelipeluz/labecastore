const slugify = require('slugify');
const Categories = require('../../models/admin/Categories');
const Responses = require('../../utils/Responses')

/* Classe responsável pelo serviços da rota admin/categories */
class CategoriesController {
  async index(req, res) {
    const responseFindAllCategories = await Categories.findAll()

    const helpRoutes = [
      'POST/admin/categories',
      'PUT/admin/categories/:id', 
      'DEL/admin/categories/:id'
    ]

    if (responseFindAllCategories.status) {
      Responses.success(res, responseFindAllCategories.data, {helpRoutes})
      return
    }
    Responses.internalServerError(res)
  }

  async create(req, res) {
    const { id, name } = req.body;

    if (name === undefined) {
      const msgError = "Name não esta sendo enviado!";
      Responses.badRequest(res, {} , {}, msgError);
      return;
    }

    if (name === '' || name === null) {
      Responses.notAcceptable(res, {}, {}, 'O nome da categoria é obrigatório.')
      return;
    }

    const data = {
      id,
      name,
      slug: slugify(name).toLowerCase(),
    };

    const responseCreateCategory = await Categories.insertData(data);

    if (responseCreateCategory.status) {
      Responses.created(res, responseCreateCategory.data)
      return
    }
    Responses.internalServerError(res)
  }

  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;

    if (name === undefined || id === undefined) {
      const msgError = "Name ou Id não estão sendo enviados!";
      Responses.badRequest(res, {}, {}, msgError);
      return;
    }

    if (name === '' || name === null) {
      Responses.notAcceptable(res, {}, {}, 'O nome da categoria é obrigatório.')
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
      Responses.unauthenticated(res, {}, {}, 'Categoria não encontrada')
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
      Responses.unauthenticated(res, {}, {}, 'Categoria não encontrada')
      return
    }

    Responses.internalServerError(res)
  }

}

module.exports = new CategoriesController();
