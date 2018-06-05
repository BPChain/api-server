// Rewrite with setChainInfo route

const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect


const config = require('../../../../config')

const privateChainConfigurator = require(
  '../../../../components/privateChainConfigurator/controller/privateConfigurator'
)

const setChainInfoFactory = privateChainConfigurator.setChainInfoFactory

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

describe('setChainInfoFactory', () => {
  describe('setChainInfoFactory construction', () => {
    it('should be constructed without an error', () => {
      assert.doesNotThrow(() => {
        const changeParametersRoute = setChainInfoFactory({
          backendController: backendControllerSuccess,
          log: testLog,
          activeChains,
        })
        assert(typeof changeParametersRoute === 'function')
      })
    })
  })

  describe('setChainInfoFactory with parameters', () => {
    it('should send expected message when no parameters were set and everything works', () => {
      const changeParametersRoute = setChainInfoFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(dummyRequest, sendSuccess))
        .to.eventually.be.rejectedWith('success')
    })
    it('should send expected message when backendController returns false', () => {
      const changeParametersRoute = setChainInfoFactory({
        backendController: backendControllerFailure,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(dummyRequest, sendError))
        .to.eventually.be.rejectedWith('send error')
    })
    it('should send expected message when json was not valid', () => {
      const changeParametersRoute = setChainInfoFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains,
      })
      return expect(changeParametersRoute(wrongRequest, sendError))
        .to.eventually.be.rejectedWith('send error')
    })
    it('should send expected message when starting chain failed', () => {
      const changeParametersRoute = setChainInfoFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {add: () => false},
      })
      return expect(changeParametersRoute(startRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when stoping chain failed', () => {
      const changeParametersRoute = setChainInfoFactory({
        backendController: backendControllerSuccess,
        log: testLog,
        activeChains: {remove: () => false},
      })
      return expect(changeParametersRoute(stopRequest, setError))
        .to.eventually.be.rejectedWith('set error')
    })
    it('should send expected message when one of multiple set/stop failed', () => {
      const changeParametersRoute = setChainInfoFactory({
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
    it('should send expected message when one of multiple set/stop failed', () => {
      const changeParametersRoute = setChainInfoFactory({
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
