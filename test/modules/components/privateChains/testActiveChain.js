const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const activeChain = require(
  '../../../../components/privateChains/activeChain'
)

const log = console

describe('privateChains', () => {
  before(() => {
    log.info('Start testing private chains')
  })
  describe('#activeChain()', () => {
    it(
      'should return false when trying to set to a chain is not implemented',
      () => {
        assert.equal(
          activeChain.set('unimplementedChain'),
          false,
        )
      })
    it(
      'should return true when trying to set to a chain is implemented',
      () => {
        assert.equal(
          activeChain.set('ethereum'),
          true,
        )
      })
    it('Should return the valid chain once it has been set', () => {
      activeChain.set('ethereum')
      assert.equal(
        activeChain.get(),
        'ethereum',
      )
    })
  })
  after(() => {
    log.info('End testing public chains')
  })
})
