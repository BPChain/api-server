const validateUser = require('./validateUser')

module.exports = (options = {}) => {
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

    if (await validateUser({
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
