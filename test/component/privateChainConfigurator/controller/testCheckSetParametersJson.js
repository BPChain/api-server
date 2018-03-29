const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')

const isValidJson = require(
  '../../../../components/privateChainConfigurator/controller/checkSetParametersJson'
)

describe('testCheckSetParametersJson', () => {
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
    it('should return false when Json has wrong keys', () => {
      assert.equal(
        isValidJson({
          json: JSON.stringify({
            'startagChain': 33,
            'stofdspChain': 33,
            'numbargrOfHosts': 'abc',
            'numbesdfOfMiners': 'cde',
            'sdf': 33,
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
      /* eslint-disable max-len */
      assert.equal(isValidJson({json: JSON.stringify({'numberOfMiners': 33}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'numberOfHosts': 33}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'numberOfMiners': 33, 'numberOfHosts': 33}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'startChain': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'stopChain': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'switchChainTo': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'startChain': 'abc', 'stopChain': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'startChain': 'abc', 'switchChainTo': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'stopChain': 'abc', 'switchChainTo': 'abc'}), log: console}), true)
      assert.equal(isValidJson({json: JSON.stringify({'startChain': 'abc', 'stopChain': 'abc', 'switchChainTo': 'abc'}), log: console}), true)
    })
  })
})
