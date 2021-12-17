const adminConnection = require('../databases/adminConnection');

class Products {
  async findAll() {
    try {
      const result = await adminConnection.select(['id', 'title', 'price', 'inventory'])
        .table('products');
      return result;
    } catch (error) {
      console.log(error);
      return false;
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
