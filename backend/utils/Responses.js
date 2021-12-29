class Response{
  success(res, data = []) {
    res.status(200)
    res.json({
      data,
    })
  }

  customSuccess(res, msg, data = []) {
    res.status(200)
    res.json({
      data,
      status: msg
    })
  }

  internalServerError(res) {
    res.status(501)
    res.json({
      data: [],
      status: 'Internal Server Error'
    })
  }

  customInternalServerError(res, index) {
    res.status(501)
    res.json({
      data: [],
      status: `Houve problemas no servidor no item ${index}`
    })
  }
  
  unauthenticated(res) {
    res.status(401)
    res.json({
      data: [],
      status: 'Não autorizado'
    })
  }

  customUnauthenticated(res, msg, data = []) {
    res.status(401)
    res.json({
      data,
      status: msg
    })
  }

  notAcceptable(res) {
    res.status(406)
    res.json({
      data: [],
      status: 'Não autorizado'
    })
  }

  customNotAcceptable(res, msg, data = []) {
    res.status(406)
    res.json({
      data,
      status: msg
    })
  }

  badRequest(res) {
    res.status(400)
    res.json({
      data: [],
      status: 'Sintaxe Inválida'
    })
  }

  customBadRequest(res, msg, data = []) {
    res.status(400)
    res.json({
      data: [],
      status: msg
    })
  }
}

module.exports = new Response();