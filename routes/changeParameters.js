module.exports = (options = {}) => {
  const {backendControllerServer, log} = options

  return async (request, response) => {
    const {
      chain,
      parameter,
      value,
    } = request.body

    log.debug(`Trying to send a change request ${chain} ${parameter} ${value}`)

    if (backendControllerServer.sendMessage({
      message: {
        chain,
        parameter,
        value,
      },
    })) {
      log.info('Successfully sent a change request')
      response.sendStatus(200)
    }
    else {
      log.warn('Error occured trying to send a change request')
      response.sendStatus(400)
    }
  }
}
