const slugify = require('slugify');
const Categories = require('../../models/admin/Categories');
const Responses = require('../../utils/Responses')

// Classe responsável pelo serviços da rota admin/categories
class CategoriesController {

  // Retorna todas as categorias
  async index(req, res) {
    const responseFindAllCategories = await Categories.findAll()

    const helpRoutes = [
      'POST/admin/categories',
      'PUT/admin/categories/:id', 
      'DEL/admin/categories/:id'
    ]

    // No Content
    if (responseFindAllCategories.status === null) {
      return Responses.noContent(res)
    }

    // Success
    if (responseFindAllCategories.status === true) {
      return Responses.success(res, responseFindAllCategories.data, {helpRoutes})
    }

    // Internal Server Error
    return Responses.internalServerError(res)
  }

  // Criação de Categorias
  async create(req, res) {
    const { id, name } = req.body;

    // Bad Request
    if (name === undefined) {
      const msgError = "Name não esta sendo enviado!";
      return Responses.badRequest(res, {} , {}, msgError);
    }
    if (name === '' || name === null) {
      return Responses.badRequest(res, {}, {}, 'O nome da categoria é obrigatório.')
    }

    // Preparando dados para inserção
    const data = {
      id,
      name,
      slug: slugify(name).toLowerCase(),
    };

    const responseCreateCategory = await Categories.insertData(data);


    // Success
    if (responseCreateCategory.status) {
      return Responses.created(res, responseCreateCategory.data)
    }

    // Internal Server Error
    return Responses.internalServerError(res)
  }

  // Atualizar Categoria
  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;

    // Bad Request
    if (name === undefined || id === undefined) {
      return Responses.badRequest(res, {}, {}, 'Name ou Id não estão sendo enviados!');
    }
    if (name === '' || name === null) {
      return Responses.notAcceptable(res, {}, {}, 'O nome da categoria é obrigatório.')
    }

    const data = {
      name,
      slug: slugify(name).toLowerCase(),
    };

    const responseUpdateData = await Categories.updateData(id, data);

    // Bad Request
    if (responseUpdateData.status === null) {
      return Responses.badRequest(res, {}, {}, 'Categoria não encontrada')
    }

    // Success
    if (responseUpdateData.status) {
      return Responses.success(res, responseUpdateData.data)
    }

    // Internal Server Error
    return Responses.internalServerError(res)
  }

  // Deletando Categoria
  async delete(req, res) {
    const { id } = req.params;

    const response = await Categories.deleteData(id);
  
    // Bad Request
    if (response.status === null) {
      return Responses.badRequest(res, {}, {}, 'Categoria não encontrada')
    }

    // Success
    if (response.status) {
      return Responses.success(res, response.data)
    }

    // Internal Server Error
    return Responses.internalServerError(res)
  }

}

module.exports = new CategoriesController();
