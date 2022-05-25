const database = require("../../databases/connection");

/* Classes responsável por criação de requisição
    para o banco de dados MySQL */
class Categories {
  async findAll() {
    try {
      const data = await database.select(['id', 'name','slug'])
        .table('categories');

      if (data.length < 1) return { status: null }

      return {status:true, data};

    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async findByProductId(ProductId) {
    try {
      const relationalBankSearch = await database
        .select('*')
        .where({ProductId})
        .table('products_categories');
      
      let imageId = [];

      if (relationalBankSearch.length > 1) {
        for(let i = 0; i < relationalBankSearch.length; i++){
          imageId.push(relationalBankSearch[i].categoryId)
        }
      } else if(relationalBankSearch.length === 1) {
        imageId.push(relationalBankSearch[0].categoryId)
      } else if (relationalBankSearch.length === 0) {
        return {status: null, data: []}
      }

      const category = await Promise.all(
        imageId.map(async item => {
          return await database.select(['id', 'name', 'slug']).table('categories').where({id: item})
        })
      ) 

      return {status: true, category}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async insertData({id = undefined, name, slug}) {
    try {
      await database.insert({id, name, slug})
        .table('categories');

      return {status: true, data: []};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async updateData(id, { name, slug }) {
    try {

      const response = await database.where({id})
      .update({name,slug})
      .table('categories');

      if (response < 1) {
        return {status: null, data: []}
      }

      return {status: true, data:[]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async deleteData(id) {
    try {
      const response = await database.where({id})
        .delete()
        .table('categories');

        if (response < 1) {
          return {status: null, data: []}
        }

      return {status: true, data: [] };
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }
}

module.exports = new Categories();
