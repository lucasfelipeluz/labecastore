const database = require("../../databases/connection")

/* Classes responsável por criação de requisição
    para o banco de dados MySQL */
class Images {
  async findAll() {
    try {
      const data = await database
        .select(['id', 'filename', 'url'])
        .table('images');

      return {status: true, data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async findById(id) {
    try {
      const data = await database
        .select(['id', 'filename', 'url'])
        .where({id})
        .table('images');

      return {status: true, data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async findByProductId(ProductId) {
    try {
      const relationalBankSearch = await database
        .select('*')
        .where({ProductId})
        .table('products_images');

      let imageId = [];

      if (relationalBankSearch.length > 1) {
        for(let i = 0; i < relationalBankSearch.length; i++){
          imageId.push(relationalBankSearch[i].imageId)
        }
      } else if(relationalBankSearch.length === 1) {
        imageId.push(relationalBankSearch[0].imageId)
      } else if (relationalBankSearch.length === 0) {
        return {status: null, data: []}
      }

      const images = await Promise.all(
        imageId.map(async item => {
          return await database.select(['id', 'filename', 'url']).table('images').where({id: item})
        })
      ) 

      return {status: true, images: images}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async findFilenaById(id) {
    try {
      const data = await database
        .select('filename')
        .where({id})
        .table('images');

      if(data.length === 0) {
        return { status: null, data: []}
      }

      const nomeDoArquivo = data[0].filename

      return {status: true, data: nomeDoArquivo}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }

  async insertData(filename, url) {
    try {
      await database.insert({filename, url})
        .table('images');

      return {status: true, data: []};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }
 
  async deleteData(id) {
    try {
      const response = await database
        .delete()
        .where({id})
        .table('images');

      if(response < 1){
        return { status: null, data: []}
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
}

module.exports = new Images();
