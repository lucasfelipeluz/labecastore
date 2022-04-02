/* Pré-sets de respostas de servidor que são mais usadas */
class Response{

  /* Respostas de sucesso */
  /* 200 - 226 */
  success(res, data = [], info = {}) {
    res.status(200);
    res.json({
      success: true,
      data,
      info,
    })
  }

  created(res, data = [], info = {}) {
    res.status(201);
    res.json({
      success: true,
      data,
      info
    })
  }

  noContent(res, data = [], info = {}) {
    res.status(204);
    res.json({
      success: true,
      data,
      info
    })
  }

  /* Respostas de erro do cliente */
  /* 400 - 451 */
  badRequest(res, data = [], info = {}, msgError = 'Requisição mal feita!') {
    res.status(400);
    res.json({
      success: false,
      msgError,
      data,
      info
    })
  }

  unauthenticated(res, data = [], info = {}, msgError = 'Credenciais inválidas!') {
    res.status(401)
    res.json({
      success: false,
      msgError,
      data,
      info,
    })
  }

  forbidden(res, data = [], info = {}, msgError = 'Você não tem permissão para acessar a rota desejada!') {
    res.status(403);
    res.json({
      success: false,
      msgError,
      data,
      info
    })
  }

  notFound(res, data = [], info = {}, msgError = 'Rota não encontrada!') {
    res.status(404);
    res.json({
      success: false,
      msgError,
      data,
      info
    })
  }

  methodNotAllowed(res, data = [], info = {}, msgError = 'Rota indisponível momentaneamente!') {
    res.status(405);
    res.json({
      success: false,
      msgError,
      data,
      info
    })
  }

  notAcceptable(res, data = [], info = {}, msgError = 'Credenciais enviadas não são válidas para acessar a rota!') {
    res.status(406)
    res.json({
      success: false,
      msgError,
      data,
      info,
    })
  }

  /* Respostas de erro do servidor */
  /* 500 - 511 */
  internalServerError(res, data = [], info = {}, msgError = 'Erro no servidor!') {
    res.status(500)
    res.json({
      success: null,
      msgError,
      data,
      info
    })
  }

  notImplemented(res, data = [], info = {}, msgError = 'Rota ainda não foi implementada!') {
    res.status(501);
    res.json({
      success: null,
      msgError,
      data,
      info
    })
  }

  serviceUnavailable(res, data = [], info = {}, msgError = 'Servidor está sobrecarregado ou em manuntenção!') {
    res.status(503);
    res.json({
      success: null,
      msgError,
      data,
      info
    })
  }
  
}

module.exports = new Response();