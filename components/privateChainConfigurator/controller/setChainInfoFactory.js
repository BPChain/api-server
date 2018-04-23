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

        if (parameters.hasOwnProperty('scenario')) {
          log.info(`Setting scenario: '${parameters.scenario.name}'`)
          activeChains.setScenario({ chainName, target, scenario: parameters.scenario })
        }
        log.info('Successfully sent a start/stop request')
        response.sendStatus(200)

      }
      else {
        log.warn('Error occured trying to send a change request')
        response.sendStatus(500)
      }
    }
  }
}
