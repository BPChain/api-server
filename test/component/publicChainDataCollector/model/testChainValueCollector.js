const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it
const chainValueCollector = require(
  '../../../../components/publicChainDataCollector/model/chainValueCollector'
)
const config = require('../../../../config')

describe('publicChains', () => {
  describe('chainValueCollector', () => {
    it('should have only the expected keys', () => {
      const expectedKeys = [
        'avgBlocktime',
        'avgHashrate',
        'numberOfMiners',
        'numberOfWorkers',
        'timeToNextEpoch',
        'timeStamp',
        'chainName',
      ]
      chainValueCollector({chainName: 'ethereum', config, log: {warn: () => {}}})
        .then(result => {
          assert.deepEqual(Object.keys(result), expectedKeys)
        })
    })
  })
})
