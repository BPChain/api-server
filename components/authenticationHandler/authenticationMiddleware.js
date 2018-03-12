module.exports = (request, response, next) => {
  if (request.isAuthenticated) {
    return next()
  }
  response.sendStatus(401)
}
