const Responses = require("../../utils/Responses");
const S3Storage = require("../../services/aws/S3Storage");

// Classe responsável pelo servições da rota admin/products
class ProductsController {
  async getAll(req, res) {
    try {
      const responseGetAll = await S3Storage.GetAll();

      return Responses.success(res, responseGetAll);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async getBase64(req, res) {
    try {
      const { filename } = req.params;
      const { folder } = req.query;

      const responseProduct = await S3Storage.GetObject(folder, filename);

      return Responses.success(res, responseProduct);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { img, pasta, nome } = req.body;

      const responseSendImage = await S3Storage.saveFile(img, pasta, nome);

      return Responses.created(res, responseSendImage);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { filename } = req.params;
      const { folder } = req.query;

      await S3Storage.deleteFile(folder, filename);

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new ProductsController();
