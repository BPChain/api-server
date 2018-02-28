const logSchema = require('./schema')

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
      store({log, logLevel: 10})
    },
    debug: (log) => {
      store({log, logLevel: 20})
    },
    info: (log) => {
      store({log, logLevel: 30})
    },
    warn: (log) => {
      store({log, logLevel: 40})
    },
    error: (log) => {
      store({log, logLevel: 50})
    },
    fatal: (log) => {
      store({log, logLevel: 60})
    },
  }
}
