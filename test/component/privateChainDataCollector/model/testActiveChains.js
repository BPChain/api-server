const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const ActiveChains = require(
  '../../../../components/privateChainDataCollector/model/ActiveChains'
)
const config = require('../../../../config')
const log = console
describe('privateChains', () => {
  describe('#getActiveChains()', () => {
    const activeChains = new ActiveChains({config})
    it('should return an empty array if no chain is active', () => {
      assert.deepEqual(
        activeChains.getActiveChains(),
        [],
      )
    })
    it('should return the active chain if it is active', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}}})
      assert.deepEqual(
        activeChains.getActiveChains(),
        [
          {
            target: 'some',
            chainName: 'someChain',
            state: {
              miners: 1,
              hosts: 1,
            },
          },
        ]
      )
    })
    it('should return the updated active chain', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}}})
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 33, hosts: 33}}})
      assert.deepEqual(
        activeChains.getActiveChains(),
        [
          {
            target: 'some',
            chainName: 'someChain',
            state: {
              miners: 33,
              hosts: 33,
            },
          },
        ]
      )
    })
    it('should return all the active chains', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}, 'someOtherChain': {miners: 1, hosts: 1}}})
      assert.deepEqual(
        activeChains.getActiveChains(),
        [
          {
            target: 'some',
            chainName: 'someChain',
            state: {
              miners: 1,
              hosts: 1,
            },
          },
          {
            target: 'some',
            chainName: 'someOtherChain',
            state: {
              miners: 1,
              hosts: 1,
            },
          },
        ]
      )
    })
    it('should return all the active chains from multiple monitors', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}, someOtherChain: {miners: 1, hosts: 1}}})
      activeChains.setState({monitor: 'someOther', state: {yetAnotherChain: {miners: 99, hosts: 33}, wurstChain: {miners: 22, hosts: 11}}})
      assert.deepEqual(
        activeChains.getActiveChains(),
        [
          {
            target: 'some',
            chainName: 'someChain',
            state: {
              miners: 1,
              hosts: 1,
            },
          },
          {
            target: 'some',
            chainName: 'someOtherChain',
            state: {
              miners: 1,
              hosts: 1,
            },
          },
          {
            target: 'someOther',
            chainName: 'yetAnotherChain',
            state: {
              miners: 99,
              hosts: 33,
            },
          },
          {
            target: 'someOther',
            chainName: 'wurstChain',
            state: {
              miners: 22,
              hosts: 11,
            },
          },
        ]
      )
    })
  })
  describe('#getScenario', () => {
    const activeChains = new ActiveChains({config})
    it('should return undefined when no scenario runs', () => {

    })
  })
  describe('#getState', () => {
    const activeChains = new ActiveChains({config})
    it('should return undefined when no state is set', () => {

    })
  })
  describe('#isChainActive', () => {
    const activeChains = new ActiveChains({config})
    it('should return false when chain is not active', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 0, hosts: 0}}})
      assert(!activeChains.isChainActive({monitor: 'some', chainName: 'someChain'}))
    })
    it('should return true when chain is active', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}}})
      assert(activeChains.isChainActive({monitor: 'some', chainName: 'someChain'}))
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 0}}})
      assert(activeChains.isChainActive({monitor: 'some', chainName: 'someChain'}))
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 0, hosts: 1}}})
      assert(activeChains.isChainActive({monitor: 'some', chainName: 'someChain'}))
    })
  })
  describe('#removeMonitor', () => {
    const activeChains = new ActiveChains({config})
    it('should remove the given monitor', () => {
      activeChains.setState({monitor: 'some', state: {someChain: {miners: 1, hosts: 1}}})
      assert.deepEqual(
        activeChains.getState({monitor: 'some'}),
        {someChain: {miners: 1, hosts: 1}}
      )
      activeChains.removeMonitor({monitor: 'some'})
      assert.equal(activeChains.getState({monitor: 'some'}), undefined)

    })
  })
})
