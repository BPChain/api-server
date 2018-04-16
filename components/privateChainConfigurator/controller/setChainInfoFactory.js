const checkSetParametersJson = require('./checkSetParametersJson')

module.exports = ({ backendController, log, activeChains }) => {
  return async (request, response) => {
    const {
      parameters,
      chainName,
      target,
    } = request.body

    log.debug(`Trying to send a change request to ${target}`)

    const isValidJson = checkSetParametersJson({ json: parameters, log })

    if (!isValidJson) {
      log.warn('json was not valid')
      response.sendStatus(500)
    }
    else {
      if (backendController.sendMessage({
        message: JSON.stringify({
          parameters,
          chainName,
        }),
        target,
      })) {
        try {
          if (parameters.hasOwnProperty('startChain')) {
            activeChains.add({chainName, target})
          }
          if (parameters.hasOwnProperty('stopChain')) {
            activeChains.remove({chainName, target})
          }
          log.info('Successfully sent a start/stop/switch request')
          response.sendStatus(200)
        }
        catch (error) {
          log.warn(`Error occured when sending start/stop: ${error.message}`)
          response.sendStatus(500)
        }
      }
      else {
        log.warn('Error occured trying to send a change request')
        response.sendStatus(500)
      }
    }
  }
}
