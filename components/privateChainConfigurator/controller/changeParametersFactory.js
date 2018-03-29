const checkSetParametersJson = require('./checkSetParametersJson')

module.exports = ({ backendController, log, activeChains }) => {
  return async (request, response) => {
    const {
      parameters,
      chainName,
      target,
    } = request.body

    log.debug(`Trying to send a change request ${target} ${parameters}`)
    log.info(backendController, activeChains, response)


    const isValidJson = checkSetParametersJson({ json: parameters, log })

    if (!isValidJson) {
      log.info('json was not valid')
      response.sendStatus(400)
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
          success = activeChains.add({chainName, target})
        }
        if (parsedJson.hasOwnProperty('stopChain')) {
          success = activeChains.remove({chainName, target})
        }
        if (parsedJson.hasOwnProperty('switchChainTo')) {
          success = activeChains.remove({chainName, target})
          success = activeChains.add({chainName: parsedJson.switchChainTo.value, target})
        }
        if (success) {
          log.info('Successfully sent a start/stop/switch request')
          response.sendStatus(200)
        }
        else {
          log.info('Error occured when sending start/stop/switch')
          response.sendStatus(500)
        }
      }
      else {
        log.info('Error occured trying to send a change request')
        response.sendStatus(500)
      }
    }
  }
}
