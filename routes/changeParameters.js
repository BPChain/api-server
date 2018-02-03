module.exports = (options = {}) => {
  const {backendController, log, activeChain} = options

  return async (request, response) => {
    const {
      parameter,
      value,
    } = request.body

    log.debug(
      `Trying to send a change request ${activeChain} ${parameter} ${value}`
    )

    if (backendController.sendMessage({
      message: {
        chain: activeChain.get(),
        parameter,
        value,
      },
      log,
    })) {
      if (parameter === 'switchChain' && activeChain.set(value)) {
        log.info('Successfully sent a change request')
        response.sendStatus(200)
      }
      else {
        log.warn('Error occured trying to send a change request')
        response.sendStatus(400)
      }
    }
  }
}
