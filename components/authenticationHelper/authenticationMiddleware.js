function authenticationMiddleware () {
  return function (request, response, next) {
    if (request.isAuthenticated) {
      return next()
    }
    response.sendStatus(401)
  }
}

module.exports = authenticationMiddleware
