const scyllaParser = require('../model/scyllaParser')
const scyllaSchema = require('../model/scyllaSchema')
const manualParser = require('../../privateChainConfigurator/model/formatConverter')

function intializeScyllaSchema ({connection}) {
  return connection.model('scylla_log', scyllaSchema)
}

function createScyllaStorage ({Storage, content, name, description}) {
  return new Storage({
    logContent: content,
    logName: name,
    timestamp: Date.now(),
    description,
  }
  )
}

module.exports.defineScenario = ({connection, log}) => {
  return async (request, response) => {

    const name = request.body.name
    const description = request.body.description || 'no description'
    const payloadSize = request.body.payloadSize
    const period = request.body.period
    const numberOfNodes = request.body.numberOfNodes

    const parsedScenario = manualParser({payloadSize, period, numberOfNodes})

    const schema = intializeScyllaSchema({connection})
    const data = createScyllaStorage({Storage: schema, content: parsedScenario, name, description})

    data.save((error, savedData) => {
      if (error) {
        log.error(`Error occured while storing parsed log: ${error}`)
        return response.status(400)
          .send(error)
      }
      else {
        log.debug('Successfully stored parsed log')
        log.debug(`Stored parsed log: ${savedData}`)
        return response.send(200)
      }
    })
  }
}


module.exports.upload = ({connection, log}) => {
  return async (request, response) => {
    const name = request.files.file.fileName
    const description = request.files.file.description || 'no description'
    // const description = request.get('Scenario-Description') || 'no description'
    if (!name) {
      return response
        .status(400)
        .send('No log name was provided!')
    }
    const uploadedLog = request.files.file.data.toString('utf8')
    log.info(uploadedLog.length)
    let parsedLog = ''
    try {
      parsedLog = scyllaParser(uploadedLog)
    }
    catch (error) {
      log.error(`Could not parse scylla file ${name}`)
      return response.status(400)
        .send(error.msg)
    }

    const schema = intializeScyllaSchema({connection})
    const data = createScyllaStorage({Storage: schema, content: parsedLog, name, description})

    data.save((error, savedData) => {
      if (error) {
        log.error(`Error occured while storing parsed log: ${error}`)
        return response.status(400)
          .send(error)
      }
      else {
        log.debug('Successfully stored parsed log')
        log.debug(`Stored parsed log: ${savedData}`)
        return response.send(200)
      }
    })
  }
}

module.exports.getScenarios = ({connection}) => {
  return async (request, response) => {
    const schema = intializeScyllaSchema({connection})
    await new Promise((resolve) => {
      schema.find({}, (error, info) => {
        if (error) {
          response.send(500)
          return resolve()
        }
        response.send(info)
        return resolve()
      })
    })
  }
}
