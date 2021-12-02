const database = require('../databases/connection');

class Categories {
  async findAll() {
    try {
      const result = await database.select(['id', 'title']).table('categories');
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async insertData({ title, slug }) {
    try {
      await database.insert({ title, slug }).into('categories');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateData(id, { title, slug }) {
    try {
      const response = await database.where({ id }).update({ title, slug }).table('categories');

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
      const response = await database.where({ id }).delete().table('categories');
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
