const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const isValidJson = require(
  '../../../../components/privateChainConfigurator/controller/checkSetParametersJson'
)

describe('testCheckSetParametersJson', () => {
  const fakeLog = {
    error: () => {},
    info: () => {},
    warn: () => {},
  }
  describe('#checkJson()', () => {
    it('should throw type error when no option was provided', () => {
      expect(() => isValidJson()).to.throw(TypeError)
    })
    it('should return false when no json was provided', () => {
      assert.throws(
        () => {
          isValidJson({log: fakeLog})
        },
        TypeError,
      )
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
          json: {
            startChain: 33,
            stopChain: 33,
            numberOfHosts: 'abc',
            numberOfMiners: 'cde',
            scenario: {
              period: 'hallol',
              payloadSize: 'seit 16 jahren 1&1',
            },
          },
          log: fakeLog,
        }),
        false,
      )
    })
    /* eslint-disable max-len */
    assert.equal(isValidJson({json: {scenario: 'hallol'}, log: fakeLog}), false)
    assert.equal(isValidJson({json: {scenario: {period: 'abece', payloadSize: 32}}, log: fakeLog}), false)
    assert.equal(isValidJson({json: {scenario: {period: 33, payloadSize: 'art'}}, log: fakeLog}), false)

    it('should return false when Json has wrong keys', () => {
      assert.equal(
        isValidJson({
          json: {
            startagChain: 33,
            stofdspChain: 33,
            numbargrOfHosts: 'abc',
            numbesdfOfMiners: 'cde',
            sdf: 33,
            scenasdrio: {
              peretre: 313,
              paylvvoadSize: 13123,
            },
          },
          log: fakeLog,
        }),
        false,
      )
    })
    assert.equal(isValidJson({json: {scenario: {frequency: 33, payloadSize: 33}}, log: fakeLog}), false)
    it('should return true when Json is as expected', () => {
      assert.equal(
        isValidJson({
          json: {
            startChain: 'abc',
            stopChain: 'cde',
            numberOfHosts: 33,
            numberOfMiners: 33,
            scenario: {
              period: 313,
              payloadSize: 13123,
            },
          },
          log: fakeLog,
        }),
        true,
      )
      /* eslint-disable max-len */
      assert.equal(isValidJson({json: {numberOfMiners: 33}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {numberOfHosts: 33}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {numberOfMiners: 33, numberOfHosts: 33}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {startChain: 'abc'}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {stopChain: 'abc'}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {startChain: 'abc', stopChain: 'abc'}, log: fakeLog}), true)
      assert.equal(isValidJson({json: {scenario: {period: 343, payloadSize: 333}}, log: fakeLog}), true)
    })
  })
})
