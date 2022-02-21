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
    const response = await Products.findAll();

    /* Verifica se o status da resposta é true, se for, retorna o Produtos */
    if (response.status) {
      Responses.success(res, response.data);
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
      Responses.customUnauthenticated(res, "Produto não encontrado!");
      return
    }

    const responseImages = await Images.findByProductId(id);
    if(responseImages.status === null) {
      Responses.customInternalServerError(res,"Erro de incompatibilidade de dados")
      return
    }
    responseProducts.data.push(responseImages.images)

    const responseCategories = await Categories.findByProductId(id);
    if(responseCategories.status === null) {
      Responses.customInternalServerError(res,"Erro de incompatibilidade de dados")
      return
    }
    responseProducts.data.push(responseCategories.category)

    Responses.success(res, responseProducts)
  }

  /* Criação de Produtos */
  async create(req, res) {
    const { 
      title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId
    } = req.body;
    /*
    Verificando se campos foram preenchidos.
    Inventory não é obrigatório
    */
    if (title === undefined || title === null || title ==='') {
      Responses.customBadRequest(res, 'Tìtulo do produto é obrigatório');
      return;
    }
    if (price === undefined || price === null || price ==='' || price === 0) {
      Responses.customBadRequest(res, 'Preço do produto é obrigatório');
      return;
    }
    if (year === undefined || year === null || year ==='' || year === '0') {
      Responses.customBadRequest(res, 'Ano do produto é obrigatório');
      return;
    }

    const dataForAdd= { title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId };
 
    const responseDatabase = await Products.insertData(dataForAdd);
    if (!responseDatabase.status){
      Responses.customInternalServerError(res, "Erro no banco de dados.");
      return
    }
    
    Responses.success(res)
    return    
  }

  /* Deletar Produtos */
  async delete(req, res) {
    const { id } = req.params;

    /* Deletando Produto e checando se deu certo */
    const responseDeleteDatabase = await Products.deleteData(id);

    if(responseDeleteDatabase.status === null){
      Responses.customUnauthenticated(res, "Produto não encontrado");
      return
    }
    if(responseDeleteDatabase.status === false){
      Responses.customInternalServerError(res, "Erro a apagar o produto");
      return
    }

    Responses.success(res)
  }

  /* Atualizando Produtos */
  async update(req, res) {
    const { 
      title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year, 
      imageId, categoryId
    } = req.body;
    let { id } = req.params;
    id = parseInt(id);
    const dataToUpdating = {
      title, description, price, inventoryPP, inventoryP,
      inventoryM, inventoryG, inventoryGG, inventoryEG, inventoryEGG, year }
    const dataToUpdatingForRelationTables = {imageId, categoryId}

    const responseUpdateDatabase = await Products.updateData(id, dataToUpdating, dataToUpdatingForRelationTables);
    if(responseUpdateDatabase.status === null){
      Responses.customUnauthenticated(res, "Produto não encontrado");
      return
    }
    if(responseUpdateDatabase.status === false){
      Responses.customInternalServerError(res, "Erro a atualizar o produto");
      return
    }

    Responses.success(res)
    res.json(responseUpdateDatabase);
  }
}

module.exports = new ProductsController();
