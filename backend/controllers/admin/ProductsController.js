const Products = require('../../models/Products');
const Responses = require('../../utils/Responses')


class ProductsController {
  async index(req, res) {
    const response = await Products.findAll();

    if (response.status) {
      Responses.success(res, response.data)
      return 
    }
    Responses.internalServerError(res)
  }

  async create(req, res) {
    const { title, price, inventory } = req.body;

    const data = {
      title,
      price,
      inventory,
    };
    const response = await Products.insertData(data);

    if (!response) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
      return;
    }

    res.status(200);
    res.json({
      status: 'Produto adicionado',
      registro: title,
    });
  }

  async update(req, res) {
    const { title, price, inventory } = req.body;
    const { id } = req.params;

    const data = {
      title,
      price,
      inventory,
    };

    const response = await Products.updateData(id, data);

    if (response.status === false) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
    }

    if (response.status === 404) {
      res.status(404);
      res.json({
        error: 'Categoria não encontrada',
      });
      return;
    }

    res.status(200);
    res.json({
      status: 'Categoria editada',
      registro: title,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const response = await Products.deleteData(id);

    if (response.status === 404) {
      res.status(404);
      res.json({
        error: 'Categoria não encontrada',
      });
      return;
    }

    if (response.status === false) {
      res.status(406);
      res.json({
        error: 'Erro interno',
      });
    }

    res.status(200);
    res.json({
      status: 'Categoria apagada.',
    });
  }
}

module.exports = new ProductsController();
