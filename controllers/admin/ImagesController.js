const Responses = require('../../utils/Responses')
const Images = require('../../models/admin/Images')

const S3Storage = require('../../services/aws/S3Storage')

//  Classe responsável por upload, deleção e atualização de Images e informações
//  admin/images
class ImagesController {

  // Retorna todas as imagens na nuvem
  async index(req, res) {
    const helpRoutes = [
      'POST/admin/images', 
      'DEL/admin/images/:id'
    ]

    const response = await Images.findAll();

    // No Content
    if (response.status === null) {
      return Responses.noContent(res);
    }

    // Success
    if (response.status === true) {
      return Responses.success(res, response.data, { helpRoutes });
    }

    // Internal Server Error
    return Responses.internalServerError(res)
  }

  // Responsável pelo Upload da imagem e salvar informações dela.
  async create(req, res) {
    async function checkResponses(res, response) {
      if (response.status) {
        return
      }
      Responses.internalServerError(res)
    }

    const { files } = req;
    if (files === undefined || files === null) return Responses.badRequest(res, [], {}, 'Nenhum arquivo está sendo enviado!')
    if (files.length < 1) return Responses.badRequest(res, [], {}, 'Nenhum arquivo está sendo enviado!')
    if (files.length > 1) return Responses.badRequest(res, [], {}, 'Apenas uma imagem por vez!')

    const nomeDoArquivo = files[0].filename;

    // Envia a imagem, e retorna uma url para acessa-la
    const responseUploadAWS = await S3Storage.saveFile(nomeDoArquivo)
    const responseCreateLinkAWS = await S3Storage.GetUrl(nomeDoArquivo)
    const responseDB = await Images.insertData(nomeDoArquivo, responseCreateLinkAWS.data)

    // Checando se tudo deu certo
    checkResponses(res, responseUploadAWS)
    checkResponses(res, responseCreateLinkAWS)
    checkResponses(res, responseDB)

    // Success
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

    const responseAWS = await S3Storage.deleteFile(responseFilename.data)
    if(responseAWS.status === false) {
      Responses.internalServerError(res, {}, {}, "Erro no servidor ao apagar a imagem");
      return
    }


    const response = await Images.deleteData(id);
    if(response.status === null) {
      Responses.unauthenticated(res, {}, {}, "Imagem não encontrada");
      return
    }

    Responses.success(res, [], `${responseFilename.data} foi apagado!`)
    return
  }

}

module.exports = new ImagesController();