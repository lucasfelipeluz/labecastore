const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Images = require("../models/Images");
const Responses = require("../utils/Responses");
const Database = require("../databases/database");

const { productPublicFilters, categoriesFilters } = require("../utils/filters");
const S3Storage = require("../services/aws/S3Storage");

// Classe responsável pelo serviços da Administradores
class PublicControllers {
  async products(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { images } = req.query;

      const products = await Products(connectionOption).findAll(
        productPublicFilters(connectionOption, req)
      );

      if (images === "true") {
        const data = await Promise.all(
          products.map(async (product) => {
            const images = await Promise.all(
              product.images.map(async (image) => {
                let folder = image.main === true ? "main" : "geral";
                let filename = image.filename;

                const img = await S3Storage.GetObject(folder, filename);

                return {
                  id: image.id,
                  filename: image.filename,
                  main: image.main,
                  active: image.active,
                  createdAt: image.createdAt,
                  updatedAt: image.updatedAt,
                  id_product: image.id_product,
                  id_product: image.id_product,
                  base64: img.data,
                };
              })
            );

            return {
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              inventoryPP: product.inventoryPP,
              inventoryP: product.inventoryP,
              inventoryM: product.inventoryM,
              inventoryG: product.inventoryG,
              inventoryGG: product.inventoryGG,
              inventoryEG: product.inventoryEG,
              inventoryEGG: product.inventoryEGG,
              year: product.year,
              active: product.active,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              categories: product.categories,
              images,
            };
          })
        );

        return Responses.created(res, data);
      }

      return Responses.created(res, products);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async categories(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const categories = await Categories(connectionOption).findAll(
        categoriesFilters(connectionOption, req)
      );

      return Responses.success(res, categories);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new PublicControllers();
