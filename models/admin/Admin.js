const database = require('../../databases/connection')

/* Classes responsável por criação de requisição
    para o banco de dados MySQL */
class User {
  async insertData(name, nickname, password, role = 0){
    try {
      await database.insert({name, nickname, password, role})
        .table('admin');
      
      return {status: true}
    } catch (error) {
      console.log(error.message);
      return { status: false, data: []}
    }
  }

  async findByNickname(nickname) {
    try {
      const data = await database.select(['nickname', 'password', 'role'])
        .where({ nickname })
        .table('admin');

      if (Object.keys(data).length >= 1) {
        return {status: true, data: data[0]};    
      } else return { status: null, data: []}
      
    } catch (error) {
      console.log(error.message);
      return { status: false, data: []}
    }
  }

  async updatePassword(nickname, password) {
    try {

      await database.where({nickname})
      .update({password})
      .table('admin');

      return {status: true, data:[]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }

  async removeUser(nickname){
    try {

      await database.where({nickname})
      .delete()
      .table('admin');

      return {status: true, data:[]};
    } catch (error) {
      console.log(error);
      return {status: false, data: []};
    }
  }
}

module.exports = new User();