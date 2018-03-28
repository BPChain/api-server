module.exports = ({backendController, log, activeChains}) => {
  return async (request, response) => {
    const {
      parameter,
      value,
      target,
    } = request.body

    log.debug(`Trying to send a change request ${target} ${parameter} ${value}`)
    log.info(backendController, activeChains, response)
    // Implement setParametersRoute
    /* if (backendController.sendMessage({
      message: {
        chainName: activeChain.get(),
        parameter,
        value,
      },
      target,
    })) {
      if (
        (parameter === 'switchChain' && activeChain.set(value)) ||
        (parameter === 'startChain')
      ) {
        log.info('Successfully sent a change request')
        response.sendStatus(200)
      }
      else {
        log.warn('Error occured trying to send a change request')
        response.sendStatus(400)
      }
    }*/
  }
}
