const bunyan = require('bunyan')

const logSchema = require('../../schemas/log')()

module.exports = (options = {}) => {
  const {connection} = options

  const LogModel = connection.model('log', logSchema)
  const logger = bunyan.createLogger({name: 'api-server'})


  function store (logOptions = {}) {
    const {log} = logOptions
    const logEntry = new LogModel({
      log,
      timeStamp: (new Date())
        .toUTCString(),
    })
    logEntry.save((error) => {
      if (error) {
        throw error
      }
    })
  }

  return {
    trace: (message) => {
      store({log: logger.trace(message)})
    },
    debug: (message) => {
      store({log: logger.debug(message)})
    },
    info: (message) => {
      store({log: logger.info(message)})
    },
    time: (message) => {
      store({log: logger.time(message)})
    },
    warn: (message) => {
      store({log: logger.warn(message)})
    },
    error: (message) => {
      store({log: logger.error(message)})
    },
  }
}
