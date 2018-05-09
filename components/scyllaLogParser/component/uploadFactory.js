const scyllaParser = require('../model/scyllaParser')
const scyllaSchema = require('../model/scyllaSchema')

function intializeScyllaSchema ({connection}) {
  return connection.model('scylla_log', scyllaSchema)
}

function createScyllaStorage ({Storage, content, name}) {
  return new Storage({
    logContent: content,
    logName: name,
    timestamp: Date.now(),
  }
  )
}

module.exports.upload = ({connection, log}) => {
  return async (request, response) => {
    const name = request.get('Scenario-Name')
    if (!request.body.log) {
      return response
        .status(400)
        .send('No file was uploaded!')
    }
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
    const data = createScyllaStorage({Storage: schema, content: parsedLog, name})

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
