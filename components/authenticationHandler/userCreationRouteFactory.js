const createUser = require('./createUser')

module.exports = ({connection, log}) => {
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
      log.debug('Returning success')
      response.sendStatus(200)
    }
    else {
      log.debug('Returning failure')
      response.sendStatus(500)
    }
  }
}
