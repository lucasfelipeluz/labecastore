const Categories = require("../models/Categories");
const Products = require("../models/admin/Products");
const Responses = require("../utils/Responses");

class PublicController {
  async products(req, res) {
    const helpRoutes = [
      "GET/products",
      "GET/products?id=XXX",
      "GET/products?category=XXX",
    ];

    if (req.query["id"]) {
      const { id } = req.query;

      const getProductById = await Products.findById(id);
      if (getProductById.status === null) return Responses.noContent(res);
      return Responses.success(res, getProductById.data, { helpRoutes });
    }

    if (req.query["category"]) {
      const { category } = req.query;

      const responseGetProductByCategory = await Products.findByCategory(
        category
      );
      if (responseGetProductByCategory.status === null)
        return Responses.noContent(res);
      if (responseGetProductByCategory.status === false)
        return Responses.internalServerError(res);

      return Responses.success(res, responseGetProductByCategory.data, {
        helpRoutes,
      });
    }

    const responseGetAllProducts = await Products.findAll();

    if (responseGetAllProducts.status === null) return Responses.noContent(res);
    return Responses.success(res, responseGetAllProducts.data);
  }

  async categories(req, res) {
    const responseFindAllCategories = await Categories.findAll();
    if (responseFindAllCategories.status === null)
      return Responses.noContent(res);
    if (responseFindAllCategories.status === false)
      return Responses.internalServerError(res);

    return Responses.success(res, responseFindAllCategories.data);
  }
}

module.exports = new PublicController();
