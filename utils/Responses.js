/* Pré-sets de respostas de servidor que são mais usadas */
class Response{
  /* Respostas de sucesso */
  /* 200 - 226 */
  success(res, data = {}, info = {}) {
    res.status(200);
    res.json({
      data,
      info
    })
  }

  created(res, data = {}, info = {}) {
    res.status(201);
    res.json({
      data,
      info
    })
  }

  /* Respostas de erro do cliente */
  /* 400 - 451 */
  badRequest(res, data = {}, info = {}){
    res.status(400);
    res.json({
      data,
      info
    })
  }

  unauthenticated(res, data = {}, info = {}) {
    res.status(401)
    res.json({
      data,
      info,
    })
  }

  notAcceptable(res, data = {}, info = {}) {
    res.status(406)
    res.json({
      data,
      info,
    })
  }

  /* Respostas de erro do servidor */
  /* 500 - 511 */
  internalServerError(res, data = {}, info = {}) {
    res.status(500)
    res.json({
      data,
      info
    })
  }
}

module.exports = new Response();