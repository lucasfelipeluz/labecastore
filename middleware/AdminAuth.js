const jwt = require('jsonwebtoken');
const Responses = require('../utils/Responses');

const secretKey = process.env.secret_key;

module.exports = (req, res, next) => {
  const authToken = req.headers['authorization']

  if (process.env.authStatus === 'true'){
    if (authToken != undefined) {
  
      const decodificado = jwt.verify(authToken, secretKey)
  
      if (decodificado.role == 0){
        next();
      } else {
        return Responses.forbidden(res, [], {}, 'Você não tem permissão para acessar essa rota!')
      }
  
    } else {
      return Responses.forbidden(res, [], {}, 'Você não está logado!')
    }
  } else {
    next();
  }

}