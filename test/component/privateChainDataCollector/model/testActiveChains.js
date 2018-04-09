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
    it('should throw an error when trying to set to a chain that is not implemented', () => {
      assert.throws(() => {
        activeChains.add({chainName: 'unimplementedChain', target: 'aws'})
      },
      'Unable to add chain unimplementedChain',
      )
    })
    it('should return undefined when trying to set to a chain that is implemented', () => {
      assert.equal(
        activeChains.add({chainName: 'ethereum', target: 'aws'}),
        undefined,
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
