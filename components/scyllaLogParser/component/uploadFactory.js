const scyllaParser = require('../model/scyllaParser')
const scyllaSchema = require('../model/scyllaSchema')

function intializeScyllaSchema ({connection}) {
  return connection.model('scylla_log', scyllaSchema)
}

function createScyllaStorage ({Storage, content, name}) {
  this.log.debug('creating recording storage')
  return new Storage({
    logContent: content,
    logName: name,
    timestamp: Date.now(),
  }
  )
}

module.exports = ({connection, log}) => {

  return async (request, response) => {
    if (!request.body.log) {
      response.status(400)
        .send('No file was uploaded!')
    }
    if (!request.params.name) {
      response.status(400)
        .send('No log name was provided!')
    }
    const uploadedLog = request.body.log
    const name = request.params.name
    const parsedLog = scyllaParser(uploadedLog)
    const schema = intializeScyllaSchema({connection})
    const data = createScyllaStorage({Storage: schema, content: parsedLog, name: name})

    data.save((error, savedData) => {
      if (error) {
        log.error(`Error occured while storing parsed log: ${error}`)
        response.status(400)
          .send(error)
      }
      else {
        log.debug('Successfully stored parsed log')
        log.debug(`Stored parsed log: ${savedData}`)
        response.send(200)
      }
    })
  }
}
