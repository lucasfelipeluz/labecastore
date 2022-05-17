const User = require("../../models/admin/Admin");
const Responses = require('../../utils/Responses');
const Encrypting = require('../../utils/Encrypting');
const jwt = require('jsonwebtoken');

const secretKey = process.env.secret_key;

/* Classe responsável pelo servições da rota Admin */
class Admin {
  async create(req, res) {
    const { name, nickname, password } = req.body;

    if (!name || !nickname || !password) {
      return Responses.badRequest(res, [], {}, 'Certifique-se que está passando o nome, nickname e senha');
    }

    const responseFindByNicknameAdmin = await User.findByNickname(nickname);

    if (responseFindByNicknameAdmin.status === true) {
      return Responses.notAcceptable(res, [], {}, 'Nickname já existe');
    }

    const hashPassword = await Encrypting.textToHash(password);

    const responseAddUser = await User.insertData(name, nickname, hashPassword);
    if (responseAddUser === false) return Responses.internalServerError(res);
    
    Responses.success(res)
  }

  async login(req, res) {
    const { nickname, password } = req.body;

    if (!nickname || !password){
      return Responses.badRequest(res, [], {}, 'Certifique-se que está passando o nickname e senha')
    }

    const {status, data} = await User.findByNickname(nickname);

    if (status === null) {
      const msgError = 'Nickname não encontrado!'
      Responses.notAcceptable(res, [], {}, msgError);
      return;
    }
    if (status === false) {
      Responses.internalServerError(res);
      return;
    }

    if (!await Encrypting.comparing(data.password, password)) {
      return Responses.unauthenticated(res, [], {}, 'Senha incorreta')
    }

    const token = jwt.sign({nickname, code: Date.now(), role: data.role }, secretKey, {expiresIn: '1h'})
    return Responses.success(res, token)
  }

  async update(req, res) {
    const { nickname, oldPassword, newPassword } = req.body;

    if (!nickname || !oldPassword || !newPassword){
      return Responses.badRequest(res, [], {}, 'Certifique-se que está a antiga senha e a nova senha');
    }

    const { status, data} = await User.findByNickname(nickname);
    if (status === null) {
      return Responses.notAcceptable(res, [], {}, 'Usuário não existe');
    }

    const comparePasswords = await Encrypting.comparing(data.password, oldPassword);
    if (comparePasswords === false) return Responses.unauthenticated(res, [], {}, 'A Senha antiga não é válida!')

    const password = await Encrypting.textToHash(newPassword);

    const responseUpdatePassword = await User.updatePassword(nickname, password);
    if (responseUpdatePassword === false ) return Responses.internalServerError(res)

    return Responses.success(res);
  }

  async remove(req, res) {
    const { nickname } = req.body;

    if (!nickname){
      return Responses.badRequest(res, [], {}, 'Que passou o nickname');
    }

    const { status } = await User.removeUser(nickname);
    if (status === false) return Responses.internalServerError(res)

    return Responses.success(res);
  }
}


module.exports = new Admin();
