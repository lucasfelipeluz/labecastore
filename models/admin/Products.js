const database = require('../../databases/connection');

/* Classes responsável por criação de requisição
    para o banco de dados MongoDB */
class Products {
  // Buscará todos os Produtos
  async findAll() {
    try {
      const data = await database
        .table('products')
        .select([
          'id', 'products.title', 'products.description', 'products.price', 'inventoryPP', 'inventoryP',
          'inventoryM', 'inventoryG', 'inventoryGG', 'inventoryEG', 'inventoryEGG', 'year'
        ])

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

  async insertData(data) {
    try {
      
      const dataForAddInProductsTable = {
        id: data.id, title: data.title, year: data.year,
        description: data.description, price: data.price, 
        inventoryPP: data.inventoryPP, inventoryP: data.inventoryP,
        inventoryM: data.inventoryM, inventoryG: data.inventoryM, 
        inventoryGG: data.inventoryGG, inventoryEG: data.inventoryEG,
        inventoryEGG: data.inventoryEG, }
      
      const responseDatabase = await database.insert(dataForAddInProductsTable)
        .table('products');

      const idProduct = responseDatabase[0];


      if(data.imageId.length > 0){
        for (let imageId of data.imageId){
          const responseDatabaseProducts_Images = await database
            .insert({productId: idProduct, imageId})
            .table('products_images')
          
          if(responseDatabaseProducts_Images.length < 1){
            throw new Error("Error ao adicionar dados do relacionamento.")
          }
        }
      }

      if(data.categoryId.length > 0) {
        for (let categoryId of data.categoryId){
          const responseDatabaseProducts_Categories = await database
            .insert({productId: idProduct, categoryId})
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
