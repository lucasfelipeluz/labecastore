const Products = require('../../models/Products');
const Responses = require('../../utils/Responses');
const Images = require('../../models/Images')

const UploadImages = require('../../aws/UploadImages')
const GetUrlImages = require('../../aws/GetUrlImages')

/* Classe responsável pelo servições da rota admin/products */
class ProductsController {

  /* Retornará todos os Produtos */
  async index(req, res) {
    const response = await Products.findAll();

    /* Verifica se o status da resposta é true, se for, retorna o Produtos */
    if (response.status) {
      Responses.success(res, response.data)
      return 
    }

    /* Caso status da resposta seja false, retornará um Erro Interno */
    Responses.internalServerError(res)
  }

  /* Criação de Produtos */
  async create(req, res) {
    const { title, description, price, idCategory,
            inventory, images
          } = req.body;

    /* 

    Verificando se campos foram preenchidos.
    Inventory não é obrigatório
    */
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
    if (Object.keys(idCategory).length < 1) {
      Responses.customBadRequest(res, 'Precisa colocar pelo menos uma categoria')
      return
    }
    if (Object.keys(images).length < 1) {
      Responses.customBadRequest(res, 'Precisa colocar pelo menos uma imagem')
      return
    }

    /* 
    Salvando os dados no banco de dados
    */

    /* Salvando informações das Imagens no Banco de dados Image*/
    Object.values(images).forEach(async (image, index, array) => {
      let filename = image.filename;
      let urlFile = image.url;
      let used = false;
      let idProduct = "undefined";

      /* Insere os dados na tabela e verifica se deu certo */
      const responseImages = await Images.insertData(filename, urlFile, idProduct, used);
      if (responseImages.status === false) Responses.internalServerError(res);

      updateInfoImages(index, Object.values(responseImages.data).toString(), array)
    })

    /* Adiciona o id do Image nas informações do Produto */
    function updateInfoImages(index, info, array) {
      images[index].idImage = info;

      /* Checar se todos os itens ja estão no images */
      if(index === array.length - 1 ) salvandoProduto(images)
    }

    /* Salva Produto */
    async function salvandoProduto(newImages) {
      /* Salva as informações e ver se deu certo */
      const responseProducts = await Products
        .insertData(title, description, inventory, idCategory, price, newImages);
      
      if (responseProducts.status === false) Responses.internalServerError(res);

      /* Adicionar Id do Produto no Image e vê se deu certo */
      Object.values(newImages).forEach(async (image) => {
        const responseUpdateImage = await Images.updateData(image.idImage, Object.values(responseProducts.data).toString())
        if (responseUpdateImage.status === false) Responses.internalServerError(res) 
      })
    }
    Responses.success(res)
  }

  /* Deletar Produtos */
  async delete(req, res) {
    const { id } = req.params;

    /* Deletando Produto e checando se deu certo */
    const responseProducts = await Products.deleteData(id);
    if (responseProducts.status === false) {
      Responses.custominternalServerError(res, 'Problemas internos ao localizar o Produto')
      return
    }
    if (responseProducts.status === null) {
      Responses.customUnauthenticated(res, 'Usuário não encontrado')
      return
    }

    /* Deletando informações da Imagem e checando se deu certo */
    const responseImages = await Images.deleteData(id);
    if (responseImages.status === false) {
      Responses.customInternalServerError(res, 'Problemas internos ao localizar a imagem')
      return
    }
    if (responseImages.status === null) {
      Responses.customUnauthenticated(res, 'Imagem não encontrado')
      return
    }

    Responses.success(res)
  }

  /* Atualizando Produtos */
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


  /* IMAGES */
  async upload(req, res) {
    async function checkResponses(res, response, index) {
      if (response.status) {
        return
      }
      Responses.customInternalServerError(res, index)
    }

    const { files } = req;

    const uploadImages = new UploadImages();
    const getUrlImages = new GetUrlImages();
    
    files.forEach(async (file, index) => {
      const responses = [];
      const responseUploadAWS = await uploadImages.execute(file.filename);
      const responseCreateLinkAWS = await getUrlImages.execute(file.filename);
      const responseDB = await Images.insertData(file.filename, responseCreateLinkAWS.data)
      
      checkResponses(res, responseUploadAWS, index)
      checkResponses(res, responseCreateLinkAWS, index)
      checkResponses(res, responseDB, index)
    })
    Responses.customSuccess(res, 'Upload concluido')
  }

  async list(req, res) {
    const response = await Images.findAll();

    if (response.status) {
      Responses.success(res, response.data)
      return 
    }
    Responses.internalServerError(res)
  }

  async deleteImg(req, res) {
    const { id } = req.params;

    const response = await Images.deleteData(id);

    if (response.status) {
      Responses.success(res, response.data)
      return
    }
    if (response.status === null) {
      Responses.customUnauthenticated(res, 'Imagem não encontrada')
      return
    }
    Responses.internalServerError(res)
  }

  async updateImg(req, res) {
    const { idProduct } = req.body;
    const { id } = req.params;

    const response = await Images.updateData(id, idProduct)

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
