const assert = require('assert')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const chainValueCollector = require(
  '../../../../components/publicChainDataCollector/model/chainValueCollector'
)
const config = require('../../../../config')
const log = console

describe('publicChains', () => {
  before(() => {
    log.info('Start testing public chains')
  })
  describe('chainValueCollector', () => {
    it('should have only the expected keys', () => {
      const expectedKeys = [
        'avgBlocktime',
        'avgHashrate',
        'numberOfMiners',
        'numberOfWorkers',
        'timeToNextEpoch',
        'timeStamp',
        'chain',
      ]
      chainValueCollector({chainName: 'ethereum', config, log: {warn: () => {}}})
        .then(result => {
          assert.deepEqual(Object.keys(result), expectedKeys)
        })
    })
  })
  after(() => {
    log.info('End testing public chains')
  })
})
