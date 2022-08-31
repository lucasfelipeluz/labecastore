const S3Storage = require('../../services/aws/S3Storage');

const Products = require('../../models/Products');
const ProductsImages = require('../../models/ProductsImages');
const Responses = require('../../utils/Responses');
const Database = require('../../databases/database');
const { productFilters } = require('../../utils/filters');
const slugify = require('slugify');
const Images = require('../../models/Images');

const addRelationship = async (connectionOption, product, image) => {
  await ProductsImages(connectionOption).create({
    productId: product.id,
    imageId: image.id,
  });
};

const updateRelationship = async (connectionOption, product, newImage, oldImage) => {
  const oldRelationship = await ProductsImages(connectionOption).findOne({
    where: {
      productId: product.id,
      imageId: oldImage.id,
    },
  });

  await oldRelationship.update({ productId: product.id, imageId: newImage.id });
};

const uploadImgMain = async (connectionOption, req, base64) => {
  const infoImage = await Images(connectionOption).create({
    filename: '',
    url: '',
    main: true,
    active: true,
    createdBy: req.user.id,
  });

  const shirtName = slugify(req.body.title).toLowerCase();
  const keyword = 'main';
  const filename = `${infoImage.id}_${shirtName}_${req.body.year}_${keyword}.png`;
  const url = S3Storage.getUrlImage('main', filename);

  const image = await infoImage.update({ filename, url });

  const { status } = await S3Storage.saveFile(base64, 'main', filename);

  if (!status) {
    await infoImage.update({ active: false });
  }

  return image;
};

const updateImgMain = async (connectionOption, req, base64, product) => {
  const imgAntiga = await Images(connectionOption).findOne({
    where: { id: product.id_img_main },
  });

  const infoImage = await Images(connectionOption).create({
    filename: '',
    url: '',
    main: true,
    active: true,
    createdBy: req.user.id,
  });

  const shirtName = slugify(product.title).toLowerCase();
  const keyword = 'main';
  const filename = `${infoImage.id}_${shirtName}_${product.year}_${keyword}.png`;
  const url = S3Storage.getUrlImage('main', filename);

  const image = await infoImage.update({ filename, url });

  const { status } = await S3Storage.saveFile(base64, 'main', filename);

  if (imgAntiga && status) {
    await imgAntiga.update({ active: false });
    await S3Storage.deleteFile('main', imgAntiga.filename);
    await updateRelationship(connectionOption, product, image, imgAntiga);
  }
  if (imgAntiga && !status) {
    await infoImage.update({ active: false });
    return { status: false };
  }

  return { status: true, image };
};

// Classe responsável pelo servições da rota admin/products
class ProductsController {
  // Retorna todos os produtos
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const helpRoutes = [
        'GET/admin/products',
        'POST/admin/products',
        'PUT/admin/products/:id',
        'DELETE/admin/products/:id',
      ];
      const responseFindAllProducts = await Products(connectionOption).findAll(
        productFilters(connectionOption, req),
      );

      return Responses.success(res, responseFindAllProducts, {
        helpRoutes,
      });
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Busca o produto pelo o id
  async getById(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const responseProduct = await Products(connectionOption).findOne(
        productFilters(connectionOption, req),
      );

      return Responses.success(res, responseProduct);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Criação de Produtos
  async create(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const {
        title,
        description,
        price,
        inventoryPP,
        inventoryP,
        inventoryM,
        inventoryG,
        inventoryGG,
        inventoryEG,
        inventoryEGG,
        year,
        base64_main,
      } = req.body;

      // Verificando se campos foram preenchidos.
      // Inventory, description, categoryId e ImageId não é obrigatório
      if (title === undefined || price === undefined || year === undefined) {
        return Responses.badRequest(res, 'Title, price ou year podem não esta sendo enviados!');
      }
      if (title === null || title === '') {
        return Responses.badRequest(res, 'Tìtulo do produto é obrigatório');
      }
      if (price === null || price === '' || price === 0) {
        return Responses.badRequest(res, 'Preço do produto é obrigatório');
      }
      if (year === null || year === '' || year === '0') {
        return Responses.badRequest(res, 'Ano do produto é obrigatório');
      }
      if (!base64_main) {
        return Responses.badRequest(res, 'A imagem principal é obrigatória');
      }

      const image = await uploadImgMain(connectionOption, req, base64_main);

      const dataForAdd = {
        title,
        description,
        price,
        inventoryPP,
        inventoryP,
        inventoryM,
        inventoryG,
        inventoryGG,
        inventoryEG,
        inventoryEGG,
        year,
        active: false,
        createdBy: req.user.id,
        id_img_main: image.id,
      };

      const responseCreateProducts = await Products(connectionOption).create(dataForAdd);

      await addRelationship(connectionOption, responseCreateProducts.dataValues, image);

      return Responses.created(res, responseCreateProducts);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Atualizando Produtos
  async update(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { id } = req.params;

      const product = await Products(connectionOption).findOne({ where: { id } });

      if (!product) {
        return Responses.badRequest(res, 'Produto não encontrado!');
      }

      const {
        title,
        description,
        price,
        inventoryPP,
        inventoryP,
        inventoryM,
        inventoryG,
        inventoryGG,
        inventoryEG,
        inventoryEGG,
        year,
        active,
        base64_main,
      } = req.body;

      if (base64_main) {
        const { status, image } = await updateImgMain(connectionOption, req, base64_main, product);
        if (!status) {
          return Responses.internalServerError(res, 'Erro em atualizar as imagens');
        }

        product.update({
          title,
          description,
          price,
          inventoryPP,
          inventoryP,
          inventoryM,
          inventoryG,
          inventoryGG,
          inventoryEG,
          inventoryEGG,
          year,
          active: active,
          id_img_main: image.id,
          updatedBy: req.user.id,
        });

        return Responses.success(res, product);
      }

      product.update({
        title,
        description,
        price,
        inventoryPP,
        inventoryP,
        inventoryM,
        inventoryG,
        inventoryGG,
        inventoryEG,
        inventoryEGG,
        year,
        active: active,
        updatedBy: req.user.id,
      });

      return Responses.success(res, product);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Deletando Produto
  async delete(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { id } = req.params;

      await Products(connectionOption).update(
        { active: false, uptadedBy: req.user.id },
        { where: { id } },
      );

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new ProductsController();
