const { type } = require('express/lib/response');
const database = require('../../databases/connection');

/* Classes responsável por criação de requisição
    para o banco de dados MongoDB */
class Products {
  // Buscará todos os Produtos
  async findAll() {
    try {
      const productsPure = await database.select(['*']).table('products')
      const products = []

      for(let product of productsPure) {

        // Category
        const products_categories = Object.values(
          await database.select(['*']).table('products_categories').where({productId: product.id })
        )

        const categoryId =  products_categories.map( item => {
          return item.categoryId
        })

        const category = []
        for (let item of categoryId){
          const arrayCategory = await database.table('categories').where({id: item}).select('name as NomeCategoria', 'slug as SlugCategoria')
          category.push(arrayCategory[0])
        }

        // Images
        const products_images = Object.values(
          await database.select(['*']).table('products_images').where({productId: product.id })
        )

        const imageId =  products_images.map( item => {
          return item.imageId
        })

        const image = []
        for (let item of imageId){
          const arrayImage = await database.table('images').where({id: item}).select('filename', 'url')
          image.push(arrayImage[0])
        }

        const newProduct = {
          id: product.id, title: product.title, description: product.description, price: product.price, year: product.year, 
          inventoryPP: product.inventoryPP, inventoryP: product.inventoryP, inventoryM: product.inventoryM, 
          inventoryG: product.inventoryG, inventoryGG: product.inventoryGG, 
          inventoryEGG: product.inventoryEGG,  category, image
        }

        products.push(newProduct)
      }

      if (products.length < 1) return { status: null }
      
      const data = products

      return { status: true, data };
    } catch (error) {
      console.log(error);
      return { status: false, data: [] };
    }
  }

  async findById(id) {
    try {
      const data = await database
        .table('products')
        .where({id})
        .select([
          'products.title', 'products.description', 'products.price', 'inventoryPP', 'inventoryP',
          'inventoryM', 'inventoryG', 'inventoryGG', 'inventoryEG', 'inventoryEGG', 'year'
        ])

      if(data.length === 0) {
        return { status: null, data: []}
      }

      return { status: true, data };
    } catch (error) {
      console.log(error)
      return { status: false, data: []}
    }
  }

  async insertData({id, title, year, description = '', price, 
    inventoryPP = 0, inventoryP = 0, inventoryM = 0,
    inventoryG = 0, inventoryGG = 0, inventoryEG = 0,
    inventoryEGG = 0, imageId = [], categoryId = [] }) {
    try {
      
      const dataForAddInProductsTable = {
        id, title, year, description, price, 
        inventoryPP, inventoryP, inventoryM,
        inventoryG, inventoryGG, inventoryEG,
        inventoryEGG }
      
      const responseDatabase = await database.insert(dataForAddInProductsTable)
        .table('products');

      const idProduct = responseDatabase[0];

      if(imageId.length > 0){
        for (let imageid of imageId){
          const responseDatabaseProducts_Images = await database
            .insert({productId: idProduct, imageid})
            .table('products_images')
          
          if(responseDatabaseProducts_Images.length < 1){
            throw new Error("Error ao adicionar dados do relacionamento.")
          }
        }
      }

      if(categoryId.length > 0) {
        for (let categoryid of categoryId){
          const responseDatabaseProducts_Categories = await database
            .insert({productId: idProduct, categoryid})
            .table('products_categories')
          
          if(responseDatabaseProducts_Categories.length < 1){
            throw new Error("Error ao adicionar dados do relacionamento.")
          }
        }
      }

      return {status: true, data: []}
    } catch (error) {
      console.log(error);
      return { status: false, data: [] };
    }
  }

  async deleteData(id) {
    try {
      const responseDatabase = await database
        .delete()
        .where({id})
        .table('products');

      if(responseDatabase < 1){
        return {status: null, data: []}
      }

      return { status: true, data: [] };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        data: []
      };
    }
  }

  async updateData(idProduct, dataToUpdating, dataToUpdatingForRelationTables) {
    try {
      const responseDatabase = await database
        .update(dataToUpdating)
        .where({id: idProduct})
        .table('products');

      if (responseDatabase < 1) {
        return {status: null, data: []}
      }

      const { imageId, categoryId } = dataToUpdatingForRelationTables; 

      if(imageId.length > 0){
        await database.delete().where({productId: idProduct}).table('products_images');
        for (let imageItem of imageId){
          const responseDatabaseProducts_Images = await database
            .insert({productId: idProduct, imageId: imageItem})
            .table('products_images')

          if(responseDatabaseProducts_Images.length < 1){
            throw new Error("Error ao adicionar dados do relacionamento.")
          }
        }
      }

      if(categoryId.length > 0) {
        await database.delete().where({productId: idProduct}).table('products_categories');
        for (let categoryItem of categoryId){
          const responseDatabaseProducts_Categories = await database
            .insert({productId: idProduct, categoryId: categoryItem})
            .table('products_categories')

          if(responseDatabaseProducts_Categories.length < 1){
            throw new Error("Error ao adicionar dados do relacionamento.")
          }
        }
      }

      return { status: true, data: [] }
    } catch (error) {
      console.log(error)
      return { status: false, data: [] }
    }
  }

}

module.exports = new Products();
