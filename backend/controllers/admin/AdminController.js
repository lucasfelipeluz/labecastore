const User = require("../../models/admin/Admin");
const Responses = require('../../utils/Responses')

/* Classe responsável pelo servições da rota Admin */
class Admin {
  index(req, res) {
    res.json({
      links: {
        login: '/login',
        category: '/categories',
        product: '/products',
      },
    });
  }

  async login(req, res) {
    const { nickname, password } = req.body;
    const response = await User.findByNickname(nickname);

    if (response.status) {
      if (Object.keys(response.data).length >= 1) {

        if (response.data.password !== password) {
          Responses.customUnauthenticated(res, 'Senha incorreta')
          return
        }

        Responses.customSuccess(res, 'Logado!')
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
