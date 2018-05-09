const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const ActiveChains = require(
  '../../../../components/privateChainDataCollector/model/ActiveChains'
)
const config = require('../../../../config')

const log = {
  info: () => {},
  error: () => {},
  debug: () => {},
}

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
      activeChains.setState(
        {
          monitor: 'some',
          state: {
            someChain: {
              miners: 1,
              hosts: 1,
            },
            someOtherChain: {
              miners: 1,
              hosts: 1,
            },
          },
        }
      )
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
      activeChains.setState(
        {
          monitor: 'some',
          state: {
            someChain: {
              miners: 1,
              hosts: 1,
            },
            someOtherChain: {
              miners: 1,
              hosts: 1,
            },
          },
        }
      )
      activeChains.setState({
        monitor: 'someOther',
        state: {
          yetAnotherChain: {
            miners: 99,
            hosts: 33,
          },
          wurstChain: {
            miners: 22,
            hosts: 11,
          },
        },
      })
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
      assert.deepEqual(activeChains.getScenario({
        chainName: 'wurstChain',
        target: 'gurkenPc'}), undefined)
    })
    it('should return the expected scenario once it has been set', () => {
      const scenario = {name: 'some', period: 123, payloadSize: 123}
      activeChains.setScenario({chainName: 'wurstChain', target: 'gurkenPc', scenario})
      assert.deepEqual(activeChains.getScenario({
        chainName: 'wurstChain',
        target: 'gurkenPc'}),
      {
        'name': 'some',
        'payloadSize': 123,
        'period': 123,
      })
    })
    it('should leave scenario undefined for chains it has not been set to', () => {
      assert.deepEqual(activeChains.getScenario({
        chainName: 'gurkenChain',
        target: 'gurkenPc'}), undefined)
      assert.deepEqual(activeChains.getScenario({
        chainName: 'wurstChain',
        target: 'wurstPc'}), undefined)
      assert.deepEqual(activeChains.getScenario({
        chainName: 'gurkenChain',
        target: 'wurstPc'}), undefined)
    })
  })
  describe('#getState', () => {
    const activeChains = new ActiveChains({config})
    it('should return {} when no state is set', () => {
      assert.deepEqual(activeChains.getState({monitor: 'some'}), {})
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
      assert.deepEqual(activeChains.getState({monitor: 'some'}), {})

    })
  })
  describe('#startRecording', () => {
    it('should set the recording state accordingly', () => {
      /* eslint-disable no-unused-vars */
      const connection = {
        model: (string, type) => {
          return class Storage {
            static findById (query, callbackFunction) {
              callbackFunction(false, true)
            }
            lines () { }
            save () { }
          }
        },
      }
      /* eslint-enable no-unused-vars */
      const activeChains = new ActiveChains({config, log, connection})
      const startRecording = activeChains.startRecording()
      const request = {
        body: {
          name: 'some',
        },
      }
      const response = {
        sendStatus: () => {
          return true
        },
        send: () => {
          return true
        },
      }
      startRecording(request, response)
      assert(activeChains.isRecording)
      assert.equal(activeChains.recordingName, request.body.name)
      assert.notEqual(activeChains.startTime, 0)
    })
  })
  describe('#getListOfRecordings', () => {
    /* eslint-disable no-unused-vars */
    const connection = {
      model: (string, type) => {
        return class Storage {
          static findById (query, callbackFunction) {
            callbackFunction(false, true)
          }
          static find (query, callbackFunction) {
            callbackFunction(false, true)
          }
          lines () { }
          save () { }
        }
      },
    }
    /* eslint-enable no-unused-vars */
    const activeChains = new ActiveChains({config, log, connection})
    const startRecording = activeChains.startRecording()
    const stopRecording = activeChains.stopRecording()
    const request = {
      body: {
        name: 'some',
      },
    }
    const response = {
      sendStatus: () => {
        return true
      },
      send: () => {
        return true
      },
    }
    startRecording(request, response)
    stopRecording(request, response)
  })
  describe('#stopRecording', () => {
    /* eslint-disable no-unused-vars */
    const connection = {
      model: (string, type) => {
        return class Storage {
          lines () { }
          save () { }
        }
      },
    }
    /* eslint-enable no-unused-vars */
    const activeChains = new ActiveChains({config, log, connection})
    const startRecording = activeChains.startRecording()
    const stopRecording = activeChains.stopRecording()
    const request = {
      body: {
        name: 'some',
      },
    }
    const response = {
      sendStatus: () => {
        return true
      },
      send: () => {
        return true
      },
    }
    startRecording(request, response)
    stopRecording(request, response)
    assert(!activeChains.isRecording)
    assert.equal(activeChains.recordingName, '')
    assert.equal(activeChains.startTime, 0)
  })
  describe('#cancelRecording', () => {
    /* eslint-disable no-unused-vars */
    const connection = {
      model: (string, type) => {
        return class Storage {
          lines () { }
          save () { }
        }
      },
    }
    /* eslint-enable no-unused-vars */
    const activeChains = new ActiveChains({config, log, connection})
    const startRecording = activeChains.startRecording()
    const cancelRecording = activeChains.cancelRecording()
    const request = {
      body: {
        name: 'some',
      },
    }
    const response = {
      sendStatus: () => {
        return true
      },
      send: () => {
        return true
      },
    }
    startRecording(request, response)
    cancelRecording(request, response)
    assert(!activeChains.isRecording)
    assert.equal(activeChains.recordingName, '')
    assert.equal(activeChains.startTime, 0)
  })
})
