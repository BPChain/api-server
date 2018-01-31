module.exports = (options = {}) => {
  const {backendController, log} = options

  return async (request, response) => {
    const {
      chain,
      parameter,
      value,
    } = request.body

    log.debug(`Trying to send a change request ${chain} ${parameter} ${value}`)

    if (backendController.sendMessage({
      message: {
        chain,
        parameter,
        value,
      },
      log,
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
