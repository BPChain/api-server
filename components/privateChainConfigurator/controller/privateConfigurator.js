const scyllaSchema = require('../../scyllaLogParser/model/scyllaSchema')

function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

const expectedKeys = [
  'startChain',
  'stopChain',
  'numberOfHosts',
  'numberOfMiners',
  'scenario',
]

function hasOnlyExpectedkeys (json) {
  if (!Object.keys(json).length) {
    return false
  }
  return Object.keys(json)
    .every(key => expectedKeys.includes(key))
}

/*
  Checks whether JSON provided by setParameters has expected Keys and values
*/
module.exports.isValidSetParametersJson = ({json, log}) => {
  if (!hasOnlyExpectedkeys(json)) {
    log.warn(`Json has not only expected keys ${json} | ${expectedKeys}`)
    return false
  }
  return Object.keys(json)
    .every(key => {
      if (['startChain', 'stopChain'].includes(key)) {
        return !isNumeric(json[key])
      }
      else if (['scenario'].includes(key)) {
        return Object.keys(json[key])
          .every(subKey => {
            if (['period', 'payloadSize'].includes(subKey)) {
              return isNumeric(json[key][subKey])
            }
            else if (['name'].includes(subKey)) {
              return !isNumeric(json[key][subKey])
            }
            else {
              return false
            }
          })
      }
      return isNumeric(json[key])
    })
}

module.exports.getChainInfoFactory = ({backendController, activeChains}) => {
  return (request, response) => {
    const privateChains = backendController
      .getClientInfos()
      .map(client => {
        const active = activeChains
          .getActiveChains()
          .some(item =>
            item.target === client.target &&
            client.chainName === item.chainName
          )
        const scenario = active
          ? activeChains
            .getScenario({chainName: client.chainName, target: client.target})
          : {}
        return Object.assign(client, {
          accessability: 'private',
          active,
          scenario,
          state: activeChains.getBackendState({
            monitor: client.target,
            chainName: client.chainName,
          }),
        })
      })
    response.send(privateChains)
  }
}

module.exports.setChainInfoFactory = ({backendController, log, activeChains, connection}) => {
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

    if (!this.isValidSetParametersJson({json: parameters, log})) {
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
          if (error || !info) {
            log.warn(`Could not find scenario: '${parameters.scenario.name}'`)
            delete parameters.scenario
            return ''
          }
          delete parameters.scenario
          return info.logContent
        })
      }

      const message = JSON.stringify({
        parameters,
        chainName,
        scenario,
      })

      if (backendController.sendMessage({
        message,
        target,
      })) {
        log.info('Successfully sent a start/stop/scenario request')
        response.sendStatus(200)
      }
      else {
        log.warn('Error occured trying to send a change request')
        response.sendStatus(500)
      }
    }
  }
}
