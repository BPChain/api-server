const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const bufferAggregator = require(
  '../../../../components/privateChainDataCollector/model/bufferAggregator'
)

const log = console
const optionsA = {
  chainName: 'ethereum',
  filledBuffer: {},
  Schema: 'Schema',
  StorageSchema: 'StorageSchema',
  connection: {
    model: (string, type) => {
      if (type === 'Schema') {
        return {
          aggregate: () => {
            return {
              exec: () => {
                return []
              },
            }
          },
          collection: {
            remove: () => {},
            find: () => {
              return {
                limit: () => {
                  return {
                    sort: () => {},
                  }
                },
              }
            },
          },
        }
      }
      else {
        return function Storage () {
          return {
            lines: () => {},
            save: () => {},
          }
        }
      }
    },
  },
  log: {
    info: () => {},
    debug: () => {},
  },
}
const optionsB = {
  chainName: 'ethereum',
  filledBuffer: {},
  Schema: 'Schema',
  StorageSchema: 'StorageSchema',
  connection: {
    model: (string, type) => {
      if (type === 'Schema') {
        return {
          aggregate: () => {
            return {
              exec: () => {
                return [{}]
              },
            }
          },
          collection: {
            remove: () => {},
          },
        }
      }
      else {
        return function Storage () {
          return {
            lines: () => {},
            save: () => {},
          }
        }
      }
    },
  },
  log: {
    info: () => {},
    debug: () => {},
  },
}
describe('publicChains', () => {
  before(() => {
    log.info('Start testing bufferAggregator')
  })
  describe('bufferAggregator', () => {
    it('should not throw an error', (done) => {
      const resultA = bufferAggregator(optionsA)
      const resultB = bufferAggregator(optionsB)
      resultA.then(result => {
        assert.equal(result, undefined)
      })
      resultB.then(result => {
        assert.equal(result, undefined)
      })
      done()
    })
  })
  after(() => {
    log.info('End testing bufferAggregator')
  })
})
