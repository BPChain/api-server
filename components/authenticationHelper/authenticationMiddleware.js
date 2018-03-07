function authenticationMiddleware () {
  return (request, result, next) => {
    if (request.isAuthenticated()) {
      return next()
    }
    result.redirect('/')
  }
}

module.exports = authenticationMiddleware
