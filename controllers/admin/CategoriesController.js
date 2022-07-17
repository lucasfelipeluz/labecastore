const slugify = require("slugify");
const Categories = require("../../models/Categories");
const Responses = require("../../utils/Responses");
const Database = require("../../databases/database");

// Classe responsável pelo serviços da rota admin/categories
class CategoriesController {
  // Retorna todas as categorias
  async index(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const filters = req.query;

      const responseFindAllCategories = await Categories(
        connectionOption
      ).findAll({
        where: filters,
      });

      const helpRoutes = [
        "POST/admin/categories",
        "PUT/admin/categories/:id",
        "DEL/admin/categories/:id",
      ];

      // No Content
      if (responseFindAllCategories.status === null) {
        return Responses.noContent(res);
      }

      // Success
      return Responses.success(res, responseFindAllCategories, {
        helpRoutes,
      });
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Criação de Categorias
  async create(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { id, name } = req.body;

      // Bad Request
      if (name === undefined) {
        const msgError = "Name não esta sendo enviado!";
        return Responses.badRequest(res, msgError, {}, {});
      }
      if (name === "" || name === null) {
        return Responses.badRequest(res, "O nome da categoria é obrigatório.");
      }

      const responseCreateCategory = await Categories(connectionOption).create({
        name,
        slug: slugify(name).toLowerCase(),
        createdBy: 4,
      });

      // Success
      return Responses.created(res, responseCreateCategory);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  // Atualizar Categoria
  async update(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { name } = req.body;
      const { id } = req.params;

      // Bad Request
      if (name === undefined || id === undefined) {
        return Responses.badRequest(
          res,
          "Name ou Id não estão sendo enviados!"
        );
      }

      if (name === "" || name === null) {
        return Responses.notAcceptable(
          res,
          "O nome da categoria é obrigatório."
        );
      }

      await Categories(connectionOption).update(
        {
          name,
          slug: slugify(name).toLowerCase(),
          updatedBy: 4,
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

  // Deletando Categoria
  async delete(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { id } = req.params;

      const response = await Categories(connectionOption).update(
        {
          active: false,
        },
        {
          where: {
            id,
          },
        }
      );

      // Bad Request
      if (response.status === null) {
        return Responses.badRequest(res, {}, {}, "Categoria não encontrada");
      }

      return Responses.success(res, response.data);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, [], {}, error);
    }
  }
}

module.exports = new CategoriesController();
