const Responses = require('../../utils/Responses')
const Images = require('../../models/Images')

const UploadImages = require('../../aws/UploadImages')
const GetUrlImages = require('../../aws/GetUrlImages')

/*  Classe responsável por upload, deleção e atualização de Images e informações
    admin/images */
class ImagesController{

  /* Retorna todas as imagens na nuvem */
  async index(req, res) {
    /* Retornar todas as imagens no BD */
    const response = await Images.findAll();

    if (response.status) {
      Responses.success(res, response.data)
      return 
    }
    Responses.internalServerError(res)
  }

  /* Responsável pelo Upload da imagem e salvar informações dela. */
  async create(req, res) {

    /* Checa se as respostas são positivas */
    async function checkResponses(res, response, index) {
      if (response.status) {
        return
      }
      Responses.customInternalServerError(res, index)
    }

    const { files } = req;

    const uploadImages = new UploadImages();
    const getUrlImages = new GetUrlImages();
    
    /* Upload */
    files.forEach(async (file, index) => {
      const responses = [];

      /* Upload AWS e criação de link de acesso a imagem */
      const responseUploadAWS = await uploadImages.execute(file.filename);
      const responseCreateLinkAWS = await getUrlImages.execute(file.filename);

      /* Salvamento de informações */
      const responseDB = await Images.insertData(file.filename, responseCreateLinkAWS.data)
      
      checkResponses(res, responseUploadAWS, index)
      checkResponses(res, responseCreateLinkAWS, index)
      checkResponses(res, responseDB, index)
    })
    Responses.customSuccess(res, 'Upload concluido')
  }

  /* Deleta as imagens na AWS e informações no BD */
  async delete(req, res) {
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

  /* Atualiza as informações das Imagens do BD */
  async update(req, res) {
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

module.exports = new ImagesController();