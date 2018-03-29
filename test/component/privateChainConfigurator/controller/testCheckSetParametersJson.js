const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')

const isValidJson = require(
  '../../../../components/privateChainConfigurator/controller/checkSetParametersJson'
)

const log = console

describe('privateChains', () => {
  before(() => {
    log.info('Start testing private chains')
  })
  const fakeLog = {
    error: () => {},
    info: () => {},
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
    it('should return false when Json has bad types', () => {
      assert.equal(
        isValidJson({
          json: JSON.stringify({
            'startChain': 33,
            'stopChain': 33,
            'numberOfHosts': 'abc',
            'numberOfMiners': 'cde',
            'switchChainTo': 33,
          }),
          log: console}),
        false,
      )
    })
    it('should return true when Json is as expected', () => {
      assert.equal(
        isValidJson({
          json: JSON.stringify({
            'startChain': 'abc',
            'stopChain': 'cde',
            'numberOfHosts': 33,
            'numberOfMiners': 33,
            'switchChainTo': 'fgh',
          }),
          log: console}),
        true,
      )
    })
  })
  after(() => {
    log.info('End testing public chains')
  })
})
