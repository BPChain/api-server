const describe = require('mocha').describe
const it = require('mocha').it
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

describe('privateChainDataCollector', () => {
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
})
