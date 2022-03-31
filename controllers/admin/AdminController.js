const User = require("../../models/admin/Admin");
const Responses = require('../../utils/Responses')

/* Classe responsável pelo servições da rota Admin */
class Admin {
  index(req, res) {
    const helpRoutes = ['/admin/login', '/admin/products', '/admin/categories', '/admin/images']

    Responses.success(res, {}, {helpRoutes});
    return;
  }

  async login(req, res) {
    const { nickname, password } = req.body;

    if(nickname === undefined || password === undefined) {
      const msgError = 'Nickname ou Password não estão sendo enviados!'      
      Responses.badRequest(res, [], {msgError})
      return;
    }

    const responseFindByNicknameAdmin = await User.findByNickname(nickname);

    if (responseFindByNicknameAdmin.status === null) {
      const msgError = 'Usuário não encontrado!'
      Responses.notAcceptable(res, [], {msgError});
      return;
    }

    if (responseFindByNicknameAdmin.status === false) {
      Responses.internalServerError(res);
      return;
    }

    Responses.success(res, [], []);
  }
}


module.exports = new Admin();
