const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it

const createLogger = require(
  '../../logger/createLogger'
)

describe('createLogger', () => {
  it('should be created with no error and support log fields', () => {
    const logger = createLogger({
      connection: {model: () => {}},
    })
    const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    logLevels.every(level => {
      return assert(Object.keys(logger)
        .includes(level))
    })
  })
  it('should store entry without error', () => {
    const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    const logger = createLogger({
      connection: {model: () => {
        return class LogModel {
          save (callbackFunction) {
            callbackFunction(false)
          }
        }
      }},
    })
    assert.doesNotThrow(() => {
      logLevels.map(level => {
        return logger[level]('')
      })
    })
  })
  it('should throw error if saving failes', () => {
    const logger = createLogger({
      connection: {model: () => {
        return class LogModel {
          save (callbackFunction) {
            callbackFunction(true)
          }
        }
      }},
    })
    assert.throws(() => {
      logger.trace('')
    })
  })
})
