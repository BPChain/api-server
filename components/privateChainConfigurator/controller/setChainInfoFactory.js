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

    const isValidJson = checkSetParametersJson({json: parameters, log})

    if (!isValidJson) {
      log.warn('json was not valid')
      response.sendStatus(500)
    }
    else {

      const schema = intializeScyllaSchema({connection})
      const scenario  = await schema.findById(parameters.scenario.name, (error, info) => {
        if (error) {
          log.warn('error when looking up schema')
          return ''
        }
        log.info('found scenario')
        return info.logContent
      })
      // lookup in database
      if (backendController.sendMessage({
        message: JSON.stringify({
          parameters,
          chainName,
          scenario,
        }),
        target,
      })) {

        if (parameters.hasOwnProperty('scenario')) {
          log.info(`Setting scenario: '${parameters.scenario.name}'`)
          activeChains.setScenario({chainName, target, scenario: parameters.scenario})
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
