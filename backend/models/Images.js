const mongoose = require('mongoose');

const ImagesModel = new mongoose.Schema({
  filename: String,
  url: String,
  idProduct: String,
  used: Boolean
})

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
      const result = await DBImages.findByIdAndDelete({ 'idProduct': idProduct })
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
