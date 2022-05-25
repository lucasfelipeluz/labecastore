const Products = require('../../models/admin/Products');
const Responses = require('../../utils/Responses');

// Classe responsável pelo servições da rota admin/products
class ProductsController {

  // Retorna todos os produtos
  async index(req, res) {
    const responseFindAllProducts = await Products.findAll();

    const helpRoutes = [
      'GET/admin/products',
      'POST/admin/products',
      'PUT/admin/products/:id',
      'DELETE/admin/products/:id',
    ]
    
    // No Content
    if (responseFindAllProducts.status === null) {
      return Responses.noContent(res)
    }

    // Success
    if (responseFindAllProducts.status) {
      return Responses.success(res, responseFindAllProducts.data, {helpRoutes});
    }

    // Internal Server Error
    return Responses.internalServerError(res);
  }

  // Criação de Produtos
  async create(req, res) {
    const { 
      id, title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId
    } = req.body;
    
    // Verificando se campos foram preenchidos.
    // Inventory, description, categoryId e ImageId não é obrigatório
    if(title === undefined || price === undefined || year === undefined) {
      return Responses.badRequest(res, [] ,{}, 'Title, price ou year podem não esta sendo enviados!');
    }
    if (title === null || title ==='') {
      return Responses.badRequest(res, [], {}, 'Tìtulo do produto é obrigatório');
    }
    if (price === null || price ==='' || price === 0) {
      return Responses.badRequest(res, [], {}, 'Preço do produto é obrigatório');
    }
    if (year === null || year ==='' || year === '0') {
      return Responses.badRequest(res, [], {}, 'Ano do produto é obrigatório');
    }

    const dataForAdd= { id, title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId };
 
    const responseCreateProducts = await Products.insertData(dataForAdd);

    // Internal Server Error
    if (responseCreateProducts.status === false){
      return Responses.internalServerError(res, [], {}, "Erro no banco de dados.");
    }
    
    //Sucess
    return Responses.created(res, [])
  }

  // Deletando Produto
  async delete(req, res) {
    const { id } = req.params;

    // Deletando Produto e checando se deu certo
    const responseDeleteDatabase = await Products.deleteData(id);

    // Bad Request
    if(responseDeleteDatabase.status === null){
      return Responses.badRequest(res, [], {}, "Produto não encontrado");
    }

    // Internal Server Error
    if(responseDeleteDatabase.status === false){
      return Responses.internalServerError(res, [], {}, "Erro em apagar o produto");
    }

    // Success
    return Responses.success(res, [])
  }

  // Atualizando Produtos
  async update(req, res) {
    const { 
      title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG,
      inventoryEGG, year, imageId, categoryId
    } = req.body;
    let { id } = req.params;
    id = parseInt(id);

    const dataToUpdating = {
      title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year }

    const dataToUpdatingForRelationTables = {imageId, categoryId}

    const responseUpdateDatabase = await Products.updateData(id, dataToUpdating, dataToUpdatingForRelationTables);

    // Bad Request
    if(responseUpdateDatabase.status === null){
      return Responses.badRequest(res, [], {},  "Produto não encontrado");
    }
    
    // Internal Server Error
    if(responseUpdateDatabase.status === false){
      return Responses.internalServerError(res, [], {}, "Erro a atualizar o produto");
    }

    // Success
    return Responses.success(res, responseUpdateDatabase.data);
  }
}

module.exports = new ProductsController();
