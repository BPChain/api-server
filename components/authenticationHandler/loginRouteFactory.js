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
          log.info(`Authenticated new session: ${request.sessionID}`)
        }
        else {
          log.error(
            `Error occured trying to cache session: ${request.sessionID}`
          )
        }
      })
      response.sendStatus('200')
    }
    else {
      log.info('User could not be logged in.')
      response.sendStatus('401')
    }
  }
}
