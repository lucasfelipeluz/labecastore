const database = require('../../databases/connection')

/* Classes responsável por criação de requisição
    para o banco de dados MySQL */
class User {
  async findByNickname(nickname) {
    try {
      const data = await database.select(['nickname', 'password'])
        .where({ nickname })
        .table('admin');

      if (Object.keys(data).length >= 1) {
        return {status: true, data: data[0]};    
      } else return { status: null, data: []}
      
    } catch (error) {
      console.log(error)
      return { status: false, data: []}
    }
  }
}

module.exports = new User();