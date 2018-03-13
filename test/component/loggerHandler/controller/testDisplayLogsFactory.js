const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const displayLogs = require(
  '../../../../components/loggerHandler/controller/displayLogsFactory'
)

const connection = {
  db: {
    collection: () => {
      return {
        find: () => {
          return {
            limit: () => {
              return {
                toArray: () => {},
                sort: () => {
                  return {
                    toArray: () => {
                      return []
                    },
                  }
                },
              }
            },
          }
        },
      }
    },
  },
}

const log = console

describe('publicChains', () => {
  before(() => {
    log.info('Start testing frontend interface')
  })
  describe('frontendInterface', () => {
    it('should create function if no options are passed', () => {
      const result = displayLogs
      assert.equal(typeof result, 'function')
    })
    it('should not throw an error', () => {
      const logDisplayFunction = displayLogs({
        connection,
      })

      assert(typeof logDisplayFunction === 'function')

      const result = {
        send: () => {},
      }

      const request0 = {
        query: {
          logLevel: 'info',
          startTime: undefined,
          endTime: undefined,
          numberOfItems: 0,
        },
      }
      logDisplayFunction(request0, result)
        .then(returnedValue => {
          assert.equal(returnedValue, undefined)
        })
      const request1 = {
        query: {
          startTime: '2018-01-16T11:22:09Z',
          endTime: '2018-01-16T11:22:20Z',
          numberOfItems: 0,
        },
      }
      logDisplayFunction(request1, result)
        .then(returnedValue => {
          assert.equal(returnedValue, undefined)
        })
    })
  })
  after(() => {
    log.info('End testing frontend interface')
  })
})
