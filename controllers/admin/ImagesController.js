const S3Storage = require('../../services/aws/S3Storage');
const Database = require('../../databases/database');
const Images = require('../../models/Images');
const ProductsImages = require('../../models/ProductsImages');
const Products = require('../../models/Products');

const Responses = require('../../utils/Responses');

const { imagesFilters } = require('../../utils/filters');
const slugify = require('slugify');

const uploadImages = async (connectionOption, req, product, img) => {
  const image = await Images(connectionOption).create({
    filename: '',
    url: '',
    main: false,
    active: true,
    createdBy: req.user.id,
  });

  const shirtName = slugify(product.title).toLowerCase();
  const keyword = 'geral';
  const filename = `${image.id}_${shirtName}_${product.year}_${keyword}.png`;
  const url = S3Storage.getUrlImage('main', filename);

  await image.update({ filename, url });
  const { status: statusAWS } = await S3Storage.saveFile(img, 'geral', filename);

  if (!statusAWS) {
    await image.update({ active: false });
    return { status: false };
  }

  return { status: true, image };
};

const addRelationship = async (connectionOption, product, image) => {
  await ProductsImages(connectionOption).create({
    productId: product.id,
    imageId: image.id,
  });
};

//  Classe responsável por upload, deleção e atualização de Images e informações
//  admin/images
class ImagesController {
  // Retorna todas as imagens no banco
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const helpRoutes = ['POST/admin/images', 'DEL/admin/images/:id'];

      const response = await Images(connectionOption).findAll(imagesFilters(connectionOption, req));

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
      const { imgs, idProduct } = req.body;

      if (imgs.length < 1) return Responses.badRequest(res, 'Imagem precisa ser enviada');
      if (!idProduct) return Responses.badRequest(res, 'Produto precisa ser enviado');

      // Verifica se o produto da imagem existe
      const product = await Products(connectionOption).findOne({
        where: { id: idProduct },
      });

      if (!product) return Responses.badRequest(res, 'Produto não encontrado');

      for (let img of imgs) {
        const { status, image } = await uploadImages(connectionOption, req, product, img);
        if (!status) {
          throw new Error('Não conseguimos completar o envio das imagens');
        }

        await addRelationship(connectionOption, product, image);
      }

      // Success
      Responses.created(res);
    } catch (error) {
      console.log(error);
      Responses.internalServerError(res, error);
    }
  }

  /* Deleta a imagem na AWS e informações no BD segundo o ID*/
  async delete(req, res) {
    // const connectionOption = Database.getConnectionOptions();
    try {
      return Responses.serviceUnavailable(res, 'Endpoint desativado temporariamente');

      // const { id } = req.params;

      // const image = await Images(connectionOption).findOne({
      //   where: {
      //     id,
      //   },
      // });

      // if (!image) return Responses.badRequest(res, 'Imagem não existe');
      // if (!image.active) return Responses.badRequest(res, 'A Imagem já foi apagada');

      // let folder = image.main === true ? 'main' : 'geral';
      // await S3Storage.deleteFile(folder, image.filename);
      // image.update({ active: false });

      // Responses.success(res, image);
    } catch (error) {
      console.log(error);
      Responses.internalServerError(res);
    }
  }
}

module.exports = new ImagesController();
