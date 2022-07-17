const Responses = require("../../utils/Responses");
const Images = require("../../models/Images");

const S3Storage = require("../../services/aws/S3Storage");
const Database = require("../../databases/database");

//  Classe responsável por upload, deleção e atualização de Images e informações
//  admin/images
class ImagesController {
  // Retorna todas as imagens no banco
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const helpRoutes = ["POST/admin/images", "DEL/admin/images/:id"];

      const response = await Images(connectionOption).findAll();

      return Responses.success(res, response, { helpRoutes });
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Retorna todas as imagens na nuvem
  async getAws(req, res) {
    try {
      const response = await S3Storage.GetAll();

      return Responses.success(res, response);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Responsável pelo Upload da imagem e salvar informações dela.
  async create(req, res) {
    const connectionOption = Database.getConnectionOptions();
    try {
      const { name, img } = req.body;

      let filename = `${name}_${Date.now()}.jpg`;

      await S3Storage.saveFile(img, filename);

      await Images(connectionOption).create({
        filename,
        createdBy: 4,
      });

      // Success
      Responses.created(res);
    } catch (error) {
      console.log(error);
      Responses.internalServerError(res, error);
    }
  }

  /* Deleta a imagem na AWS e informações no BD segundo o ID*/
  async delete(req, res) {
    const connectionOption = Database.getConnectionOptions();
    try {
      const { id } = req.params;

      const image = await Images(connectionOption).findOne({
        where: {
          id,
        },
      });

      await S3Storage.deleteFile(image.filename);

      await Images(connectionOption).update(
        {
          active: false,
        },
        {
          where: {
            id,
          },
        }
      );

      Responses.success(res, image);
    } catch (error) {
      console.log(error);
      Responses.internalServerError(res);
    }
  }
}

module.exports = new ImagesController();
