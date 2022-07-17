const Products = require("../../models/Products");
const Responses = require("../../utils/Responses");

const Database = require("../../databases/database");

// Classe responsável pelo servições da rota admin/products
class ProductsController {
  // Retorna todos os produtos
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const helpRoutes = [
        "GET/admin/products",
        "POST/admin/products",
        "PUT/admin/products/:id",
        "DELETE/admin/products/:id",
      ];
      const responseFindAllProducts = await Products(
        connectionOption
      ).findAll();

      return Responses.success(res, responseFindAllProducts, {
        helpRoutes,
      });
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async getById(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { id } = req.params;

      const responseProduct = await Products(connectionOption).findOne({
        where: {
          id,
        },
      });

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
        id,
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
      } = req.body;

      // Verificando se campos foram preenchidos.
      // Inventory, description, categoryId e ImageId não é obrigatório
      if (title === undefined || price === undefined || year === undefined) {
        return Responses.badRequest(
          res,
          "Title, price ou year podem não esta sendo enviados!"
        );
      }
      if (title === null || title === "") {
        return Responses.badRequest(res, "Tìtulo do produto é obrigatório");
      }
      if (price === null || price === "" || price === 0) {
        return Responses.badRequest(res, "Preço do produto é obrigatório");
      }
      if (year === null || year === "" || year === "0") {
        return Responses.badRequest(res, "Ano do produto é obrigatório");
      }

      const dataForAdd = {
        id,
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
        createdBy: 4,
      };

      const responseCreateProducts = await Products(connectionOption).create(
        dataForAdd
      );

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
      } = req.body;
      const { id } = req.params;

      const responseUpdateDatabase = await Products(connectionOption).update(
        {
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
          updatedBy: 4,
        },
        {
          where: {
            id,
          },
        }
      );

      // Success
      return Responses.success(res);
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
        {
          active: 0,
        },
        {
          where: {
            id,
          },
        }
      );

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new ProductsController();
