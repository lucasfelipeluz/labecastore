const User = require("../../models/admin/Admin");
const Responses = require('../../utils/Responses')

/* Classe responsável pelo servições da rota Admin */
class Admin {
  index(req, res) {
    const helpRoutes = ['/admin/login', '/admin/products', '/admin/categories']
    Responses.success(res, [], {helpRoutes});
  }

  async login(req, res) {
    const { nickname, password } = req.body;
    if(nickname === undefined || password === undefined) {
      const msgError = 'Nickname ou Password não estão sendo enviados!'      
      Responses.badRequest(res, [], {msgError})
      return;
    }
    const response = await User.findByNickname(nickname);

    if (response.status) {
      if (Object.keys(response.data).length >= 1) {

        if (response.data.password !== password) {
          Responses.customUnauthenticated(res, 'Senha incorreta')
          return
        }

        Responses.success(res, [], {status: 'Logado!'})
        return
        
      } else {
        Responses.customUnauthenticated(res, 'Usuário não encontrado')
        return
      }
    }
    Responses.internalServerError(res)
  }
}


module.exports = new Admin();
