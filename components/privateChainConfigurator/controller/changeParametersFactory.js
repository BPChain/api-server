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
        message: {
          parameters,
          chainName,
        },
        target,
      })) {
        const parsedJson = JSON.parse(parameters)
        let success = true
        if (parsedJson.hasOwnProperty('startChain')) {
          success = activeChains.add({chainName, target}) && success ? true : false
        }
        if (parsedJson.hasOwnProperty('stopChain')) {
          success = activeChains.remove({chainName, target}) && success ? true : false
        }
        if (parsedJson.hasOwnProperty('switchChainTo')) {
          success = activeChains.remove({chainName, target}) ? true : false
          success = activeChains.add({chainName: parsedJson.switchChainTo.value, target}) &&
            success ? true : false
        }
        if (success) {
          log.info('Successfully sent a start/stop/switch request')
          response.sendStatus(200)
        }
        else {
          log.warn('Error occured when sending start/stop/switch')
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
