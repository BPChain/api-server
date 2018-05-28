const  userHandler = require('./userHandler')

module.exports.authenticate = (request, response, next) => {
  if (request.isAuthenticated) {
    return next()
  }
  response.sendStatus(401)
}

module.exports.logout = (request, response) => {
  try {
    request.session.destroy()
    response
      .status(200)
      .send('logged out')
  }
  catch (error) {
    response
      .status(500)
      .send('error')
  }
}

module.exports.loginRouteFactory = (options = {}) => {
  const {
    connection,
    sessionCache,
    log,
  } = options

  return async (request, response) => {
    const {
      username,
      password,
    } = request.body

    if (await userHandler.validateUser({
      username,
      password,
      connection,
    })) {
      sessionCache.set(request.sessionID, true, (error, success) => {
        if (!error && success) {
          log.debug(`Authenticated new session: ${request.sessionID}`)
        }
        else {
          log.error(
            `Error occured trying to cache session: ${request.sessionID}`
          )
        }
      })
      response
        .status(200)
        .send('true')
    }
    else {
      log.debug('User could not be logged in.')
      response
        .status(200)
        .send('false')
    }
  }
}
