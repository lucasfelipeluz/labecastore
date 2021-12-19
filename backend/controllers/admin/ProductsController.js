const Products = require('../../models/Products');
const Responses = require('../../utils/Responses');
const Images = require('../../models/Images')

const UploadImages = require('../../aws/UploadImages')
const GetUrlImages = require('../../aws/GetUrlImages')

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
    
    console.log({title, description, inventory,
      idCategory, price, images})

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

    const responseProducts = await Products.deleteData(id);
    if (responseProducts.status) {
      Responses.success(res, responseProducts.data)
      return
    }
    if (responseProducts.status === null) {
      Responses.customUnauthenticated(res, 'Usuário não encontrado')
      return
    }

    const responseImages = await Images.deleteData(id);
    if (responseImages.status) {
      Responses.success(res, response.data)
      return
    }
    if (responseImages.status === null) {
      Responses.customUnauthenticated(res, 'Imagem não encontrado')
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
