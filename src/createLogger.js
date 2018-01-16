const logSchema = require('../schemas/log')()

const stdoutLog = console

module.exports = (options = {}) => {
  const {connection} = options

  const LogModel = connection.model('log', logSchema)


  function store (logOptions = {}) {
    const {log, logLevel} = logOptions

    stdoutLog.info(log)
    const logEntry = new LogModel({
      log,
      logLevel,
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
    trace: (log) => {
      store({log, logLevel: 'trace'})
    },
    debug: (log) => {
      store({log, logLevel: 'debug'})
    },
    info: (log) => {
      store({log, logLevel: 'info'})
    },
    warn: (log) => {
      store({log, logLevel: 'warn'})
    },
    error: (log) => {
      store({log, logLevel: 'error'})
    },
    fatal: (log) => {
      store({log, logLevel: 'fatal'})
    },
  }
}
