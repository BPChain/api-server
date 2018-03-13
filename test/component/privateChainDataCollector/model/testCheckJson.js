const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')

const isValidJson = require(
  '../../../../components/privateChainDataCollector/model/checkJsonContent'
)

const log = console

describe('privateChains', () => {
  before(() => {
    log.info('Start testing private chains')
  })
  const fakeLog = {
    error: () => {},
  }
  describe('#checkJson()', () => {
    it('should return false when no options are provided', () => {
      assert.equal(isValidJson(), false)
    })
    it('should return false when Json is not valid', () => {
      assert.equal(
        isValidJson({json: 'IAmNotAJsonString', log: fakeLog}),
        false,
      )
    })
    it('should return false when Json is empty', () => {
      assert.equal(
        isValidJson({json: JSON.stringify({}), log: fakeLog}),
        false,
      )
    })
    it('should return false when Json is missing fields', () => {
      assert.equal(
        isValidJson({json: JSON.stringify({hostId: 'anId'}), log: fakeLog}),
        false,
      )
    })
    it('should return false when Json has bad types', () => {
      assert.equal(
        isValidJson({
          json: JSON.stringify({
            'chainName': 'ethereum',
            'hostId': 'abc',
            'isMining': 'false',
            'hashrate': '45',
            'avgBlocktime': '64',
            'gasPrice': 533,
            'avgDifficulty': 56,
          }),
          log: fakeLog}),
        false,
      )
    })
    it('should return true when Json is as expected', () => {
      assert.equal(
        isValidJson({
          json: JSON.stringify({
            'chainName': 'ethereum',
            'hostId': 'abc',
            'isMining': 1,
            'hashrate': 45,
            'avgBlocktime': 64,
            'gasPrice': 533,
            'avgDifficulty': 56,
          }),
          log: fakeLog}),
        true,
      )
    })
  })
  after(() => {
    log.info('End testing public chains')
  })
})
