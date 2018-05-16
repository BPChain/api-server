const checkSetParametersJson = require('./checkSetParametersJson')
const scyllaSchema = require('../../scyllaLogParser/model/scyllaSchema')

module.exports = ({backendController, log, activeChains, connection}) => {
  return async (request, response) => {
    const {
      parameters,
      chainName,
      target,
    } = request.body

    function intializeScyllaSchema () {
      return connection.model('scylla_log', scyllaSchema)
    }

    log.debug(`Trying to send a change request to ${target}`)

    if (!checkSetParametersJson({json: parameters, log})) {
      log.warn('json was not valid')
      response.sendStatus(500)
    }
    else {
      let scenario = ''
      if (parameters.hasOwnProperty('scenario')) {
        log.info(`Setting scenario: '${parameters.scenario.name}'`)
        activeChains.setScenario({chainName, target, scenario: parameters.scenario})

        const schema = intializeScyllaSchema({connection})
        scenario = await schema.findById(parameters.scenario.name, (error, info) => {
          if (error) {
            log.warn(`Could not find scenario: ${error.message}`)
            return ''
          }
          return info.logContent
        })
      }

      if (backendController.sendMessage({
        message: JSON.stringify({
          parameters,
          chainName,
          scenario,
        }),
        target,
      })) {
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
