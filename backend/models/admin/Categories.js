const mongoose = require('mongoose');

const CategoriesModel = new mongoose.Schema({
  title: String,
  slug: String,
})

/* Classes responsável por criação de requisição
    para o banco de dados MongoDB */
const categories = mongoose.model('Categories', CategoriesModel);

class Categories {
  async findAll() {
    try {
      const data = await categories.find();
      return {status:true, data};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async insertData({ title, slug }) {
    try {
      const newCategory = new categories({
        title, slug
      })
      await newCategory.save()

      return {status: true, data: []};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async deleteData(id) {
    try {
      const result = await categories.findByIdAndDelete({'_id': id})
      
      if (result === null) return {status: null, data: []}

      return {status: true, data: [] };
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async updateData(id, { title, slug }) {
    try {
      const response = await categories.findByIdAndUpdate(id, {title, slug})

      if(response === null ) return {status: null, data: []}

      return {status: true, data:[]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }


}

module.exports = new Categories();
