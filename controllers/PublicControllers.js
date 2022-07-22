const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Images = require("../models/Images");
const Responses = require("../utils/Responses");
const Database = require("../databases/database");

const { productPublicFilters, categoriesFilters } = require("../utils/filters");

// Classe responsável pelo serviços da Administradores
class PublicControllers {
  async products(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const products = await Products(connectionOption).findAll(
        productPublicFilters(connectionOption, req)
      );

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
