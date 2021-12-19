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
    idcategory: Number, 
    idcategory1: Number, 
    idcategory2: Number, 
    idcategory3: Number, 
    idcategory4: Number, 
  },
  price: Number,
  images: {
    img: {url: String, filename: String},
    img1: {url: String, filename: String},
    img2: {url: String, filename: String},
    img3: {url: String, filename: String},
    img4: {url: String, filename: String}
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

  async insertData(title, description, inventory, idCategory, price, images) {
    try {
      const newProduct = new products({
        title, description, inventory,
        idCategory, price, images
      })

      await newProduct.save()
      return {status: true, data: []};
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
}

module.exports = new Products();
