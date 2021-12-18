const Products = require('../../models/Products');
const Responses = require('../../utils/Responses')


class ProductsController {
  async index(req, res) {
    const response = await Products.findAll();

    if (response.status) {
      Responses.success(res, response.data)
      return 
    }
    Responses.internalServerError(res)
  }

  async create(req, res) {
    const {
      title, description, inventory,
      idCategory, price, images
    } = req.body;
    
    if (Object.keys(images).length < 1) {
      Responses.customBadRequest(res, 'Precisa colocar pelo menos uma imagem')
      return
    }
    if (Object.keys(idCategory).length < 1) {
      Responses.customBadRequest(res, 'Precisa colocar pelo menos uma categoria')
      return
    }
    if (title === '' || title === undefined || title === null) {
      Responses.customNotAcceptable(res, 'Título é obrigatório')
      return
    }
    if (description === '' || description === undefined || description === null) {
      Responses.customNotAcceptable(res, 'A Descrição é obrigatória')
      return
    }
    if (price === '' || price === undefined || price === null || price < 1) {
      Responses.customNotAcceptable(res, 'O preço é obrigatório e não pode ser 0')
      return
    }

    const response = await Products.insertData(title, description, inventory, idCategory, price, images)
    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    Responses.internalServerError(res)
  
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = await Products.deleteData(id);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    if (response.status === null) {
      Responses.customUnauthenticated(res, 'Usuário não encontrado')
      return
    }
    Responses.internalServerError(res)
  }

  async update(req, res) {
    const {
      title, description, price, inventory, idCategory, images
    } = req.body;
    const { id } = req.params;

    const data = {
      title, description, price, inventory, idCategory, images
    };

    const response = await Products.updateData(id, data)
    
    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    if (response.status === null) {
      Responses.customUnauthenticated(res, 'Usuário não encontrado')
      return
    }


    Responses.internalServerError(res)
  }
}

module.exports = new ProductsController();
