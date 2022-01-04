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
  idCategory: {
    0: Number, 
    1: Number, 
    2: Number, 
    3: Number, 
    4: Number, 
  },
  price: Number,
  images: {
    0: {url: String, filename: String, idImage: String},
    1: {url: String, filename: String, idImage: String},
    2: {url: String, filename: String, idImage: String},
    3: {url: String, filename: String, idImage: String},
    4: {url: String, filename: String, idImage: String}
  }
})

const products = mongoose.model('Products', ProductsModel);


/* Classes responsável por criação de requisição
    para o banco de dados MongoDB */
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

  async insertData(title, description, inventory, idCategory, price, images) {
    try {
      const newProduct = new products({
        title, description, inventory,
        idCategory, price, images
      })
      await newProduct.save()
      return {status: true, data: [newProduct._id]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async deleteData(id) {
    try {
      const result = await products.findByIdAndDelete({ '_id': id })
      if (result === null) {
        return {status: null, data: []}
      }
      return { status: true, data: []};
    } catch (error) {
      console.log(error);
      return {
        status: false,
        data: []
      };
    }
  }

  async updateData(id, { title, description, price, inventory, idCategory, images }) {
    try {
      const response = await products.findByIdAndUpdate(id,
        { title, description, price, inventory, idCategory, images })
      
      if (response === null) return { status: null, data: [] }
      
      return {status: true, data: []}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async updateDataImage(id, images) {
    try {
      const response = await products.findByIdAndUpdate(id, {images})

      if (response === null) return { status: null, data: [] }
      
      return {status: true, data: []}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }
}

module.exports = new Products();
