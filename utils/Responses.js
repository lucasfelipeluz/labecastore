/* Pré-sets de respostas de servidor que são mais usadas */
class Response {
  /* Respostas de sucesso */
  /* 200 - 226 */
  success(res, data = [], info = {}) {
    res.status(200);
    res.json({
      success: true,
      data,
      info,
    });
  }

  created(res, data = [], info = {}) {
    res.status(201);
    res.json({
      success: true,
      data,
      info,
    });
  }

  noContent(res, data = [], info = {}) {
    res.status(204);
    res.json({
      success: true,
      data,
      info,
    });
  }

  /* Respostas de erro do cliente */
  /* 400 - 451 */
  badRequest(res, msgError = "Requisição mal feita!", data = [], info = {}) {
    res.status(400);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  unauthenticated(
    res,
    msgError = "Credenciais inválidas!",
    data = [],
    info = {}
  ) {
    res.status(401);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  forbidden(
    res,
    msgError = "Você não tem permissão para acessar a rota desejada!",
    data = [],
    info = {}
  ) {
    res.status(403);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  notFound(res, msgError = "Rota não encontrada!", data = [], info = {}) {
    res.status(404);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  methodNotAllowed(
    res,
    msgError = "Rota indisponível momentaneamente!",
    data = [],
    info = {}
  ) {
    res.status(405);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  notAcceptable(
    res,
    msgError = "Credenciais enviadas não são válidas para acessar a rota!",
    data = [],
    info = {}
  ) {
    res.status(406);
    res.json({
      success: false,
      msgError,
      data,
      info,
    });
  }

  /* Respostas de erro do servidor */
  /* 500 - 511 */
  internalServerError(
    res,
    msgError = "Erro no servidor!",
    data = [],
    info = {}
  ) {
    res.status(500);
    res.json({
      success: null,
      msgError,
      data,
      info,
    });
  }

  notImplemented(
    res,
    msgError = "Rota ainda não foi implementada!",
    data = [],
    info = {}
  ) {
    res.status(501);
    res.json({
      success: null,
      msgError,
      data,
      info,
    });
  }

  serviceUnavailable(
    res,
    msgError = "Servidor está sobrecarregado ou em manuntenção!",
    data = [],
    info = {}
  ) {
    res.status(503);
    res.json({
      success: null,
      msgError,
      data,
      info,
    });
  }
}

module.exports = new Response();
