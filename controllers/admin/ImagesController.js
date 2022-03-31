const Responses = require('../../utils/Responses')
const Images = require('../../models/admin/Images')

const UploadImages = require('../../aws/UploadImages')
const GetUrlImages = require('../../aws/GetUrlImages')
const DeleteImage = require('../../aws/DeleteImage')

/*  Classe responsável por upload, deleção e atualização de Images e informações
    admin/images */
class ImagesController {
  /* Retorna todas as imagens na nuvem */
  async index(req, res) {
    /* Retornar todas as imagens no BD */
    const response = await Images.findAll();

    if (response.status) {
      Responses.success(res, response.data)
      return 
    }
    Responses.internalServerError(res)
    return
  }

  /* Responsável pelo Upload da imagem e salvar informações dela. */
  async create(req, res) {
    async function checkResponses(res, response) {
      if (response.status) {
        return
      }
      Responses.customInternalServerError(res)
    }

    const { files } = req;
    const nomeDoArquivo = files[0].filename;

    const uploadImages = new UploadImages();
    const getUrlImages = new GetUrlImages();

    const responseUploadAWS = await uploadImages.execute(nomeDoArquivo);
    const responseCreateLinkAWS = await getUrlImages.execute(nomeDoArquivo);
    const responseDB = await Images.insertData(nomeDoArquivo, responseCreateLinkAWS.data)

    checkResponses(res, responseUploadAWS)
    checkResponses(res, responseCreateLinkAWS)
    checkResponses(res, responseDB)

    Responses.created(res)
  }

  /* Deleta a imagem na AWS e informações no BD segundo o ID*/
  async delete(req, res) {
    const { id } = req.params;

    const responseFilename = await Images.findFilenaById(id);

    if (responseFilename.status === null) {
      Responses.unauthenticated(res, {}, {}, "Imagem não encontrada!");
      return
    }

    const deleteImage = new DeleteImage();
    const responseAWS = await deleteImage.execute(responseFilename.data);
    if(responseAWS.status === false) {
      Responses.internalServerError(res, {}, {}, "Erro no servidor ao apagar a imagem");
      return
    }


    const response = await Images.deleteData(id);
    if(response.status === null) {
      Responses.unauthenticated(res, {}, {}, "Imagem não encontrada");
      return
    }

    Responses.success(res, responseFilename.data)
    return
  }

}

module.exports = new ImagesController();