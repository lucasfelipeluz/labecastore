const adminConnection = require('../../databases/adminConnection')

class User {
  async findByNickname(nickname) {
    try {
      const data = await adminConnection.select(['nickname', 'password']).where({ nickname }).table('admin');
      if (Object.keys(data).length >= 1) {
        return {status: true, data: data[0]};    
      } else return { status: true, data: []}
      
    } catch (error) {
      console.log(error)
      return { status: false, data: []}
    }
  }

  async create(nickname, name, password, role = 1) {
    try {
      await adminConnection.insert({ nickname, name, password, role })
        .table('admin');
        return {status: true, data: []}
      
      } catch (error) {
      console.log(error)
      return { status: false, data: []}
    }
  }
}

module.exports = new User();