const assert = require('assert')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const changeParametersFactory = require(
  '../../../../components/privateChainConfigurator/controller/changeParametersFactory'
)
const log = console

describe('ChangeParametersFactory', () => {
  before(() => {
    log.info('Start testing ChangeParametersFactory')
  })
  describe('ChangeParametersFactory construction', () => {
    it('should be constructed without an error', () => {
      assert.doesNotThrow(() => {
        const changeParametersRoute = changeParametersFactory()
        assert(typeof changeParametersRoute === 'function')
      })
    })
  })
  describe('ChangeParametersFactory with parameters', () => {
    let result = []
    const response = {sendStatus: (statusCode) => result.push(statusCode)}
    it('should do nothing when backendController returns false', () => {
      const backendController = {sendMessage: () => false}
      const changeParametersRoute = changeParametersFactory(
        {log: console, backendController, activeChain: {get: () => {}, set: () => {}}})
      changeParametersRoute({body: {parameter: 1, value: 2, target: 3}}, response)
      assert.deepEqual(result, [])
    })
    it('should set response status to 200 with startChain parameter', () => {
      const backendController = {sendMessage: () => true}
      const changeParametersRoute = changeParametersFactory(
        {log: console, backendController, activeChain: {get: () => {}, set: () => {}}})
      changeParametersRoute({body: {parameter: 'startChain', value: 2, target: 3}}, response)
      assert.deepEqual(result, [200])
    })
    it('should set response status to 200 with switchChain parameter', () => {
      result = []
      const backendController = {sendMessage: () => true}
      const changeParametersRoute = changeParametersFactory(
        {log: console, backendController, activeChain: {get: () => {}, set: () => true}})
      changeParametersRoute({body: {parameter: 'switchChain', value: 2, target: 3}}, response)
      assert.deepEqual(result, [200])
    })
    it('should set response status to 400 with not implemented parameter', () => {
      result = []
      const backendController = {sendMessage: () => true}
      const changeParametersRoute = changeParametersFactory(
        {log: console, backendController, activeChain: {get: () => {}, set: () => true}})
      changeParametersRoute({body: {parameter: 'iDoNotExist', value: 2, target: 3}}, response)
      assert.deepEqual(result, [400])
    })
    it('should set response status to 400 when activeChain.set fails', () => {
      result = []
      const backendController = {sendMessage: () => true}
      const changeParametersRoute = changeParametersFactory(
        {log: console, backendController, activeChain: {get: () => {}, set: () => false}})
      changeParametersRoute({body: {parameter: 'switchChain', value: 2, target: 3}}, response)
      assert.deepEqual(result, [400])
    })
  })
  after(() => {
    log.info('End testing BlockchainController')
  })
})

