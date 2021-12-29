const User = require("../../models/admin/Users");
const Responses = require('../../utils/Responses')

/* Classe responsável pelo servições da rota Admin */
class Admin {
  index(req, res) {
    res.json({
      links: {
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

        Responses.customSuccess(res, 'Logado!', response.data)
        return
      } else {
        Responses.customUnauthenticated(res, 'Usuário não encontrado')
        return
      }
    }
    Responses.internalServerError(res)

  }

  async newUser(req, res) {
    const { nickname, name, password } = req.body;
    const response = await User.findByNickname(nickname);

    if (response.status) {

      if (Object.keys(response.data).length >= 1) {
        Responses.customNotAcceptable(res, 'Nome de usuário já existe!')
      } else {

        if (name === '' || name === undefined || name === null) {
          Responses.customNotAcceptable(res, 'Nome inválido!')
          return
        }

        if (password === '' || password === undefined || password === null) {
          Responses.customNotAcceptable(res, 'Senha inválida!')
          return
        }

        const responseCreate = await User.create(nickname, name, password);
        if (responseCreate.status) {
          Responses.customSuccess(res, 'Usuário cadastrado')
          return
        }
        Responses.internalServerError(res)
      }


    } else {
      Responses.internalServerError(res)
    }
  }

}


module.exports = new Admin();
