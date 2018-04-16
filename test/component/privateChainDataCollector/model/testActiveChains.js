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
    it('should execute removeChainOf({target}) correctly', () => {
      activeChains.add({chainName: 'ethereum', target: 'fsoc'})
      activeChains.removeChainsOf({target: 'fsoc'})
      assert.deepEqual(activeChains.getChains(),
        [
          {
            chainName: 'ethereum',
            scenario: {name: 'noScenario', payloadSize: 0, period: 0},
            target: 'aws',
          },
        ]
      )
    })
    it('should execute remove({chainName, target}) correctly', () => {
      activeChains.remove({chainName: 'ethereum', target: 'aws'})
      assert.deepEqual(activeChains.getChains(), [])
    })
  })
  after(() => {
    log.info('End testing private chains')
  })
})
