const mongoose = require('mongoose');

const ProductsModel = new mongoose.Schema({
  title: String,
  description: String,
  inventory: {
    pp: Number,
    p: Number,
    m: Number,
    g: Number,
    gg: Number,
    eg: Number,
    egg: Number,
  },
  idCategory: Number,
  price: Number,
  images: {
    urlImages: String,
    urlImages1: String,
    urlImages2: String,
    urlImages3: String,
    urlImages4: String,
  }
})

const products = mongoose.model('Products', ProductsModel);

class Products {
  async findAll() {
    try {
      const data = await products.find()
      return {status: true, data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async insertData({ title, price, inventory }) {
    try {
      await adminConnection.insert({ title, price, inventory: JSON.stringify(inventory) }).into('products');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateData(id, { title, price, inventory }) {
    try {
      const response = await adminConnection.where({ id })
        .update({ title, price, inventory: JSON.stringify(inventory) })
        .table('products');

      if (response === 0) {
        return {
          status: 404,
        };
      }

      return {
        status: true,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
      };
    }
  }

  async deleteData(id) {
    try {
      const response = await adminConnection.where({ id }).delete().table('products');
      if (response === 0) {
        return {
          status: 404,
        };
      }
      return { status: true };
    } catch (error) {
      console.log(error);
      return {
        status: false,
      };
    }
  }
}

module.exports = new Products();
