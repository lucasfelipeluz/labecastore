const Products = require('../models/Products');
const Categories = require('../models/Categories');
const Images = require('../models/Images');
const Responses = require('../utils/Responses');
const Database = require('../databases/database');

const {
  productPublicFilters,
  categoriesFilters,
  productPublicMoreAcessFilters,
  productBySlugFilters
} = require('../utils/filters');
const ProductsCategories = require('../models/ProductsCategories');
const ProductsImages = require('../models/ProductsImages');
const HitsProducts = require('../models/HitsProducts');

const addOneView = async (connectionOption, id) => {
  const hitProduct = await HitsProducts(connectionOption).findOne({ where: { id_product: id } });
  let { number_of_hits } = hitProduct;
  await hitProduct.update({ number_of_hits: ++number_of_hits });
};

// Classe responsável pelo serviços da Administradores
class PublicControllers {
  async products(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      let products;
      if (req.query.top === 'true') {
        products = await Products(connectionOption).findAll(
          productPublicMoreAcessFilters(connectionOption, req),
        );
      } else {
        products = await Products(connectionOption).findAll(
          productPublicFilters(connectionOption, req),
        );
      }

      // if (req.query.id && products.length > 0) {
      //   await addOneView(connectionOption, req.query.id);
      // }

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

  async productsByCategorySlug(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const products = await Products(connectionOption)
        .findAll(productBySlugFilters(connectionOption, req))

      const category = await Categories(connectionOption).findOne({ where: { slug: req.params.slug } })


      return Responses.success(res, products, { statusCategory: { exists: !!category, name: category ? category.name : undefined } });
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
