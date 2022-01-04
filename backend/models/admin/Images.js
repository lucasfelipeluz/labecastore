const mongoose = require('mongoose');

const ImagesModel = new mongoose.Schema({
  filename: String,
  url: String,
  idProduct: String,
  used: Boolean
})

/* Classes responsável por criação de requisição
    para o banco de dados MongoDB */
const DBImages = mongoose.model('Images', ImagesModel);

class Images {
  async findAll() {
    try {
      const data = await DBImages.find()
      return {status: true, data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async findById(id) {
    try {
      const data = await DBImages.findById(id)
      return {status: true, data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async insertData(filename, url, idProduct, used = false) {
    try {
      const newImage = new DBImages({filename, url, idProduct, used})
      await newImage.save()

      return {status: true, data: [newImage._id]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async deleteData(idProduct) {
    try {
      const result = await DBImages.deleteMany({ idProduct });
      if (result.deletedCount < 1) {
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

  async deleteById(id) {
    try {
      const result = await DBImages.findByIdAndDelete(id)
      if (result.deletedCount < 1) {
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

  async updateData(id, idProduct) {
    try {
      const response = await DBImages.findByIdAndUpdate(id,
        { idProduct })
      
      if (response === null) return { status: null, data: [] }
      
      return {status: true, data: []}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

}

module.exports = new Images();
