const Products = require('../../models/admin/Products');
const Responses = require('../../utils/Responses');
const Images = require('../../models/admin/Images');
const Categories = require('../../models/admin/Categories');

const UploadImages = require('../../aws/UploadImages');
const GetUrlImages = require('../../aws/GetUrlImages');

/* Classe responsável pelo servições da rota admin/products */
class ProductsController {
/* Retornará todos os Produtos */
  async index(req, res) {
    const responseFindAllProducts = await Products.findAll();

    /* Verifica se o status da resposta é true, se for, retorna o Produtos */
    const helpRoutes = [
      'GET/admin/products/details/:id',
      'POST/admin/products',
      'PUT/admin/products/:id',
      'DELETE/admin/products/:id',
    ]
    if (responseFindAllProducts.status) {
      Responses.success(res, responseFindAllProducts.data, {helpRoutes});
      return;
    }

    /* Caso status da resposta seja false, retornará um Erro Interno */
    Responses.internalServerError(res);
  }

  /* Retorna detalhes do produto */
  async details(req, res){
    const { id } = req.params;

    const responseProducts = await Products.findById(id)
    if (responseProducts.status === null) {
      Responses.unauthenticated(res, [], {}, "Produto não encontrado!");
      return
    }

    const responseImages = await Images.findByProductId(id);
    if(responseImages.status === null) {
      Responses.internalServerError(res, [], {}, "Erro de incompatibilidade de dados com as Imagens")
      return
    }

    const responseCategories = await Categories.findByProductId(id);
    if(responseCategories.status === null) {
      Responses.internalServerError(res, [], {}, "Erro de incompatibilidade de dados com as Categorias")
      return
    }

    const response = {
      Product: responseProducts.data,
      Categories: responseCategories.category,
      Images: responseImages.images
    }

    Responses.success(res, response)
  }

  /* Criação de Produtos */
  async create(req, res) {
    const { 
      id, title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId
    } = req.body;
    /*
    Verificando se campos foram preenchidos.
    Inventory não é obrigatório
    */
    if(title === undefined || price === undefined || year === undefined) {
      const msgError = "Title, price ou year podem não esta sendo enviados!";
      Responses.badRequest(res, [] ,{}, msgError);
      return;
    }
    if (title === null || title ==='') {
      Responses.badRequest(res, [], {}, 'Tìtulo do produto é obrigatório');
      return;
    }
    if (price === null || price ==='' || price === 0) {
      Responses.badRequest(res, [], {}, 'Preço do produto é obrigatório');
      return;
    }
    if (year === null || year ==='' || year === '0') {
      Responses.badRequest(res, [], {}, 'Ano do produto é obrigatório');
      return;
    }

    const dataForAdd= { id, title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId };
 
    const responseCreateProducts = await Products.insertData(dataForAdd);
    if (!responseCreateProducts.status){
      Responses.internalServerError(res, [], {}, "Erro no banco de dados.");
      return
    }
    
    Responses.success(res, [])
    return    
  }

  /* Deletar Produtos */
  async delete(req, res) {
    const { id } = req.params;

    /* Deletando Produto e checando se deu certo */
    const responseDeleteDatabase = await Products.deleteData(id);

    if(responseDeleteDatabase.status === null){
      Responses.unauthenticated(res, [], {}, "Produto não encontrado");
      return
    }
    if(responseDeleteDatabase.status === false){
      Responses.internalServerError(res, [], {}, "Erro a apagar o produto");
      return
    }

    Responses.success(res, [])
  }

  /* Atualizando Produtos */
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
    if(responseUpdateDatabase.status === null){
      Responses.unauthenticated(res, [], {},  "Produto não encontrado");
      return
    }
    if(responseUpdateDatabase.status === false){
      Responses.internalServerError(res, [], {}, "Erro a atualizar o produto");
      return
    }

    Responses.success(res, responseUpdateDatabase.data);
  }
}

module.exports = new ProductsController();
