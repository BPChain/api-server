const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const ActiveChains = require(
  '../../../../components/privateChainDataCollector/model/ActiveChains'
)
const config = require('../../../../config')
const log = console
const activeChains = new ActiveChains({config})
describe('privateChains', () => {
  before(() => {
    log.info('Start testing private chains')
  })
  describe('#activeChain()', () => {
    it('should return false when trying to set to a chain is not implemented', () => {
      assert.equal(
        activeChains.add({chainName: 'unimplementedChain', target: 'aws'}),
        false,
      )
    })
    it('should return true when trying to set to a chain is implemented', () => {
      assert.equal(
        activeChains.add({chainName: 'ethereum', target: 'aws'}),
        true,
      )
    })
    it('Should return the valid chain once it has been set', () => {
      assert(activeChains
        .getChains()
        .some(item => item.chainName === 'ethereum')
      )
    })
  })
  after(() => {
    log.info('End testing private chains')
  })
})
