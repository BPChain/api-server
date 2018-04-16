const sleepSeconds = require('sleepjs').sleepSeconds
const checkSetParametersJson = require('./checkSetParametersJson')

const defaultScenario = {
  name: 'defaultScenario',
  period: 30,
  payloadSize: 20,
}

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
            await sleepSeconds(5)
            log.info(`Setting scenario: '${defaultScenario.name}'`)
            activeChains.setScenario({chainName, target, scenario: defaultScenario})
          }
          if (parameters.hasOwnProperty('stopChain')) {
            activeChains.remove({chainName, target})
          }
          if (parameters.hasOwnProperty('scenario')) {
            log.info(`Setting scenario: '${parameters.scenario.name}'`)
            activeChains.setScenario({chainName, target, scenario: parameters.scenario})
          }
          log.info('Successfully sent a start/stop request')
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
