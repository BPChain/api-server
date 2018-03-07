const createUser = require('./createUser')

module.exports = (options = {}) => {
  const {
    connection,
    log,
  } = options

  return async (request, response) => {
    const {
      username,
      password,
    } = request.body

    const success = await createUser({
      connection,
      log,
      username,
      password,
    })
    if (success) {
      log.info(success)
      log.info('Returning success')
      response.sendStatus(200)
    }
    else {
      log.info(success)
      log.info('Returning failure')
      response.sendStatus(500)
    }
  }
}
