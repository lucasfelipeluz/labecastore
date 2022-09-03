const Products = require('../models/Products');
const Categories = require('../models/Categories');
const Images = require('../models/Images');
const Responses = require('../utils/Responses');
const Database = require('../databases/database');

const { productPublicFilters, categoriesFilters } = require('../utils/filters');
const ProductsCategories = require('../models/ProductsCategories');
const ProductsImages = require('../models/ProductsImages');

// Classe responsável pelo serviços da Administradores
class PublicControllers {
  async products(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const products = await Products(connectionOption).findAll(
        productPublicFilters(connectionOption, req),
      );

      return Responses.success(res, products);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async categories(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const categories = await Categories(connectionOption).findAll(
        categoriesFilters(connectionOption, req),
      );

      return Responses.success(res, categories);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async productsByCategoryId(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const category = await Categories(connectionOption).findOne({
        where: { slug: req.params.slug },
      });

      if (!category) return Responses.badRequest(res, 'Categoria não encontrada');

      const nameCategory = category.name;

      const categories = await ProductsCategories(connectionOption).findAll({
        where: {
          categoryId: category.id,
        },
      });

      const products = await Promise.all(
        categories.map(async (category) => {
          const product = await Products(connectionOption).findOne({
            include: [
              {
                model: Categories(connectionOption),
              },
              {
                model: Images(connectionOption),
              },
              {
                model: Images(connectionOption),
                as: 'img_main',
              },
            ],
            where: { id: category.productId },
          });

          const productImages = await ProductsImages(connectionOption).findAll({
            where: { productId: product.id },
          });

          const images = await Promise.all(
            productImages.map(async (productImage) => {
              const image = await Images(connectionOption).findOne({
                where: { id: productImage.imageId },
                attributes: { exclude: ['updatedAt', 'createdAt'] },
              });

              return { ...image.dataValues };
            }),
          );

          return { ...product.dataValues, images, nameCategory };
        }),
      );

      return Responses.success(res, products, category);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async search(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();
      const { keyword } = req.params;

      const allProducts = await Products(connectionOption).findAll({
        include: [
          {
            model: Categories(connectionOption),
          },
          {
            model: Images(connectionOption),
          },
          {
            model: Images(connectionOption),
            as: 'img_main',
          },
        ],
        where: { active: true },
      });

      const allCategories = await Categories(connectionOption).findAll({
        where: {
          active: true,
        },
      });

      let products = [];
      let categories = [];

      // Pesquisando pelo nome
      const filteredProducts = allProducts.filter((product) => {
        let shirtTitle = product.title.toLowerCase();
        if (shirtTitle.includes(keyword.toLowerCase())) {
          return product;
        }
      });
      if (filteredProducts.length < 1) {
        const newFilteredProducts = allProducts.filter((product) => {
          for (let category of product.categories) {
            let categoryName = category.dataValues.slug;
            if (categoryName.includes(keyword)) return product;
          }
        });

        products = newFilteredProducts;
      } else {
        products = filteredProducts;
      }

      // Pesquisando a categoria pelo nome
      categories = allCategories.filter((category) => {
        let nameCategory = category.slug;
        if (nameCategory.includes(keyword.toLowerCase())) {
          return category;
        }
      });

      const data = {
        products,
        categories,
      };

      return Responses.success(res, data);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new PublicControllers();
