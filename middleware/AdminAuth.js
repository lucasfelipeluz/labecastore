const jwt = require('jsonwebtoken');
const Responses = require('../utils/Responses');

const secretKey = process.env.secret_key;

module.exports = (req, res, next) => {
  const authToken = req.headers['authorization']

  if (process.env.authStatus === 'true'){

    if (authToken != undefined) {

  
      jwt.verify(authToken, secretKey, {}, (error, decoded) => {
        if (error) {
          return Responses.unauthenticated(res, [], {}, 'Token inválido, ou expirado!')
        }
        if (decoded) {
          next()
        }
      })
  
  
    } else return Responses.forbidden(res, [], {}, 'Você não está logado!')

  } else next();
}