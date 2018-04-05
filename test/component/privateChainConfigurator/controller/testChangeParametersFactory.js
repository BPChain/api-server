// Rewrite with setChainInfo route

const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect


const config = require('../../../../config')

const changeParametersFactory = require(
  '../../../../components/privateChainConfigurator/controller/changeParametersFactory'
)

const ActiveChains = require(
  '../../../../components/privateChainDataCollector/model/ActiveChains'
)

const activeChains = new ActiveChains({config})

const backendControllerSuccess = {
  sendMessage () {
    return true
  },
}

const backendControllerFailure = {
  sendMessage () {
    return false
  },
}


const sendSuccess = {
  sendStatus () {
    throw new Error('success')
  },
}

const sendError = {
  sendStatus () {
    throw new Error('send error')
  },
}

const setError = {
  sendStatus () {
    throw new Error('set error')
  },
}

const dummyRequest = {
  body: {
    parameters: JSON.stringify({
      'numberOfMiners': 333,
    }),
    chainName: 'ethereum',
    target: 'aws',
  },
}

const wrongRequest = {
  body: {
    parameters: {
      'numberOfHosts': '"3"',
    },
    chainName: 'ethereum',
    target: 'aws',
  },
}

const startRequest = {
  body: {
    parameters: JSON.stringify({
      'startChain': 'xain',
    }),
    chainName: 'ethereum',
    target: 'aws',
  },
}

const stopRequest = {
  body: {
    parameters: JSON.stringify({
      'stopChain': 'xain',
    }),
    chainName: 'ethereum',
    target: 'aws',
  },
}

const switchRequest = {
  body: {
    parameters: JSON.stringify({
      'switchChainTo': 'xain',
    }),
    chainName: 'ethereum',
    target: 'aws',
  },
}

const startStopRequest = {
  body: {
    parameters: JSON.stringify({
      'stopChain': 'xain',
      'startChain': 'multichain',
    }),
    chainName: 'ethereum',
    target: 'aws',
  },
}

const testLog = {
  error: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
}

describe('ChangeParametersFactory', () => {
  describe('ChangeParametersFactory construction', () => {
    it('should be constructed without an error', () => {
      assert.doesNotThrow(() => {
        const changeParametersRoute = changeParametersFactory({
          backendController: backendControllerSuccess,
          log: testLog,
          activeChains,
        })
        assert(typeof changeParametersRoute === 'function')
      })
    })
  })

  describe('ChangeParametersFactory with parameters', () => {
    it('should send expected message when no parameters were set and everything works', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(dummyRequest, sendSuccess))
        .to.eventually.be.rejectedWith('success')
    })
    it('should send expected message when backendController returns false', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerFailure,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(dummyRequest, sendError))
        .to.eventually.be.rejectedWith('send error')
    })
    it('should send expected message when json was not valid', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(wrongRequest, sendError))
        .to.eventually.be.rejectedWith('send error')
    })
    it('should send expected message when starting chain failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {add: () => false},
      })
      return expect(changeParametersRoute(startRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when stoping chain failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {remove: () => false},
      })
      return expect(changeParametersRoute(stopRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when switching chain failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {
          add: () => false,
          remove: () => false,
        },
      })
      return expect(changeParametersRoute(switchRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when switching chain failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {
          add: () => true,
          remove: () => false,
        },
      })
      return expect(changeParametersRoute(switchRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when switching chain failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {
          add: () => false,
          remove: () => true,
        },
      })
      return expect(changeParametersRoute(switchRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when one of multiple set/stop/switch failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {
          add: () => true,
          remove: () => false,
        },
      })
      return expect(changeParametersRoute(startStopRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when one of multiple set/stop/switch failed', () => {
      const changeParametersRoute = changeParametersFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {
          add: () => false,
          remove: () => true,
        },
      })
      return expect(changeParametersRoute(startStopRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
  })
})
