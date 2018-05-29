const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const DataCollector = require(
  '../../../../components/privateChainDataCollector/controller/DataCollector'
)
const config = Object.assign(require('../../../../config'),
  {
    ports: {
      dataAggregator: 4321,
    },
  }
)

const log = console

describe('privateChainDataCollector', () => {
  before(() => {
    log.info('Start testing DataCollector')
  })
  describe('listener', () => {
    it('should return correct object without error', () => {
      assert.doesNotThrow(() => {
        const dataCollector = new DataCollector({
          activeChain: {get: () => 'ethereum'},
          log: console,
          config,
          connection: {
            model: () => class Buffer {
              save () {}
            },
          },
        })
        dataCollector.stopBuffer()
      }, 'Error')
    })
  })
  after(() => {
    log.info('End testing listener')
  })
})
