/* Pré-sets de respostas de servidor que são mais usadas */
class Response{

  /* Respostas de sucesso */
  /* 200 - 226 */
  success(res, data, info) {
    res.status(200);
    res.json({
      data,
      info,
    })
  }

  created(res, data, info) {
    res.status(201);
    res.json({
      data,
      info
    })
  }

  noContent(res, data, info) {
    res.status(204);
    res.json({
      data,
      info
    })
  }

  /* Respostas de erro do cliente */
  /* 400 - 451 */
  badRequest(res, data, info) {
    res.status(400);
    res.json({
      data,
      info
    })
  }

  unauthenticated(res, data, info) {
    res.status(401)
    res.json({
      data,
      info,
    })
  }

  forbidden(res, data, info) {
    res.status(403);
    res.json({
      data,
      info
    })
  }

  notFound(res, data, info) {
    res.status(404);
    res.json({
      data,
      info
    })
  }

  methodNotAllowed(res, data, info) {
    res.status(405);
    res.json({
      data,
      info
    })
  }

  notAcceptable(res, data, info) {
    res.status(406)
    res.json({
      data,
      info,
    })
  }

  /* Respostas de erro do servidor */
  /* 500 - 511 */
  internalServerError(res, data, info) {
    res.status(500)
    res.json({
      data,
      info
    })
  }

  notImplemented(res, data, info) {
    res.status(501);
    res.json({
      data,
      info
    })
  }

  serviceUnavailable(res, data, info) {
    res.status(503);
    res.json({
      data,
      info
    })
  }
  
}

module.exports = new Response();