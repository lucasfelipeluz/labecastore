const Users = require('../models/Users');
const Responses = require('../utils/Responses');
const Encrypting = require('../utils/Encrypting');
const jwt = require('jsonwebtoken');
const Database = require('../databases/database');

const secretKey = process.env.secret_key;

// Classe responsável pelo serviços da Administradores
class UsersControllers {
  async create(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { name, nickname, password, role } = req.body;

      if (!name || !nickname || !password) {
        return Responses.badRequest(
          res,
          'Certifique-se que está passando o nome, nickname e senha',
        );
      }

      const responseRepeatNickname = await Users(connectionOption).findOne({
        where: { nickname },
      });
      if (responseRepeatNickname) {
        return Responses.notAcceptable(res, 'Nickname já existe');
      }

      const hashPassword = await Encrypting.textToHash(password);

      await Users(connectionOption).create({
        name,
        nickname,
        password: hashPassword,
        role,
      });

      return Responses.created(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async login(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { nickname, password } = req.body;

      if (!nickname || !password) {
        return Responses.badRequest(res, 'Certifique-se que está passando o nickname e senha');
      }

      const user = await Users(connectionOption).findOne({
        where: { nickname },
      });

      if (!user) {
        return Responses.unauthenticated(res, 'Usuário não existe!');
      }
      if (user.active < 1) {
        return Responses.forbidden(res, 'Usuário ainda não foi aprovado!');
      }

      if (!(await Encrypting.comparing(user.password, password))) {
        return Responses.unauthenticated(res, 'Senha incorreta');
      }

      const token = jwt.sign({ id: user.id, nickname, role: user.role }, secretKey, {
        expiresIn: '1h',
      });

      return Responses.success(res, token);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async update(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { nickname, oldPassword, newPassword } = req.body;

      if (!nickname || !oldPassword || !newPassword) {
        return Responses.badRequest(res, 'Certifique-se que está a antiga senha e a nova senha');
      }

      const user = await Users(connectionOption).findOne({
        where: { nickname },
      });

      if (!user) {
        return Responses.unauthenticated(res, 'Usuário não existe!');
      }
      if (user.active < 1) {
        return Responses.forbidden(res, 'Usuário ainda não foi aprovado!');
      }

      if (!(await Encrypting.comparing(user.password, oldPassword))) {
        return Responses.unauthenticated(res, 'Senha incorreta');
      }

      const hashNewPassword = await Encrypting.textToHash(newPassword);

      await Users(connectionOption).update(
        {
          password: hashNewPassword,
        },
        {
          where: {
            nickname,
          },
        },
      );

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }

    // const { nickname, oldPassword, newPassword } = req.body;

    // if (!nickname || !oldPassword || !newPassword){
    //   return Responses.badRequest(res, [], {}, 'Certifique-se que está a antiga senha e a nova senha');
    // }

    // const { status, data} = await User.findByNickname(nickname);
    // if (status === null) {
    //   return Responses.notAcceptable(res, [], {}, 'Usuário não existe');
    // }

    // const comparePasswords = await Encrypting.comparing(data.password, oldPassword);
    // if (comparePasswords === false) return Responses.unauthenticated(res, [], {}, 'A Senha antiga não é válida!')

    // const password = await Encrypting.textToHash(newPassword);

    // const responseUpdatePassword = await User.updatePassword(nickname, password);
    // if (responseUpdatePassword === false ) return Responses.internalServerError(res)

    // return Responses.success(res);
  }

  async checkUser(req, res) {
    try {
      const token = req.body.token;

      let data = {
        valid: false,
        role: 0,
      };

      jwt.verify(token, secretKey, {}, (error, decoded) => {
        if (error) {
          data = {
            valid: false,
            role: 0,
          };
        }
        if (decoded) {
          data = {
            valid: true,
            role: decoded.role,
          };
        }
      });

      return Responses.success(res, data);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async authorizeUser(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();
      const userLoggedIn = req.user;

      if (userLoggedIn.role < 4) {
        return Responses.forbidden(res, 'Você não tem permissão para autorizar usuários!');
      }

      const { nickname } = req.body;

      if (!nickname) {
        return Responses.badRequest(res, 'Certifique-se de passar o nickname');
      }

      await Users(connectionOption).update({ active: 1 }, { where: { nickname } });

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const connectionOption = Database.getConnectionOptions();

      const { nickname } = req.body;

      if (!nickname) {
        return Responses.badRequest(res, 'Certifique-se de passar o nickname');
      }

      const user = await Users(connectionOption).findOne({
        where: { nickname },
      });

      if (!user) {
        return Responses.unauthenticated(res, 'Usuário não existe!');
      }
      if (user.active < 1) {
        return Responses.forbidden(res, 'Usuário ainda não foi aprovado!');
      }

      await Users(connectionOption).update({ active: 0 }, { where: { nickname } });

      return Responses.success(res);
    } catch (error) {
      console.log(error);
      return Responses.internalServerError(res, error);
    }
  }
}

module.exports = new UsersControllers();
