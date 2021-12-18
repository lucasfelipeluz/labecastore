const mongoose = require('mongoose');

const CategoriesModel = new mongoose.Schema({
  title: String,
  slug: String,
})

module.exports = CategoriesModel;

class Categories {
  async findAll() {
    try {
      const result = await adminConnection.select(['id', 'title']).table('categories');
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async insertData({ title, slug }) {
    try {
      await adminConnection.insert({ title, slug }).into('categories');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateData(id, { title, slug }) {
    try {
      const response = await adminConnection.where({ id }).update({ title, slug }).table('categories');

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
      const response = await adminConnection.where({ id }).delete().table('categories');
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

module.exports = new Categories();
