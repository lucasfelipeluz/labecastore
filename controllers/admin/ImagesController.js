const S3Storage = require("../../services/aws/S3Storage");
const Database = require("../../databases/database");
const Images = require("../../models/Images");
const ProductsImages = require("../../models/ProductsImages");
const Products = require("../../models/Products");

const Responses = require("../../utils/Responses");

const { imagesFilters } = require("../../utils/filters");

//  Classe responsável por upload, deleção e atualização de Images e informações
//  admin/images
class ImagesController {
  // Retorna todas as imagens no banco
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const helpRoutes = ["POST/admin/images", "DEL/admin/images/:id"];

      const response = await Images(connectionOption).findAll(
        imagesFilters(connectionOption, req)
      );

      return Responses.success(res, response, { helpRoutes });
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Responsável pelo Upload da imagem e salvar informações dela.
  async create(req, res) {
    const connectionOption = Database.getConnectionOptions();
    try {
      const { main, img, idProduct } = req.body;

      // Verifica se o produto da imagem existe
      const product = await Products(connectionOption).findOne({
        where: { id: idProduct },
      });

      if (!product) return Responses.badRequest(res, "Produto não encontrado");

      let folder = main === true ? "main" : "geral";

      // Verifica se a imagem vai ser única, se for
      // vai apagar a antiga e enviar a nova
      if (main === true) {
        const repeatedImage = await Images(connectionOption).findOne({
          where: {
            id_product: product.id,
            main,
            active: true,
          },
        });

        if (repeatedImage) {
          await S3Storage.deleteFile(folder, repeatedImage.filename);
          repeatedImage.update({ active: false });
        }
      }

      // Salva o registro da imagem nova
      const image = await Images(connectionOption).create({
        filename: "",
        main: req.body.main,
        active: true,
        createdBy: req.user.id,
        id_product: product.id,
      });

      let filename = `${image.id}_${product.id}_${folder}.png`;

      // Atualiza o nome dela
      image.update({ filename });

      // Salva a relação do produto com a imagem
      await ProductsImages(connectionOption).create({
        productId: product.id,
        imageId: image.id,
      });

      // Envia a imagem para a S3
      await S3Storage.saveFile(img, folder, filename);

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

      if (!image) return Responses.badRequest(res, "Imagem não existe");
      if (!image.active)
        return Responses.badRequest(res, "A Imagem já foi apagada");

      let folder = image.main === true ? "main" : "geral";
      await S3Storage.deleteFile(folder, image.filename);
      image.update({ active: false });

      Responses.success(res, image);
    } catch (error) {
      console.log(error);
      Responses.internalServerError(res);
    }
  }
}

module.exports = new ImagesController();
