const assert = require('assert')

const WebSocket = require('ws')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const BlockchainController = require(
  '../../../../components/privateChainConfigurator/controller/BlockchainController'
)
const log = console

describe('BlockchainController', () => {
  before(() => {
    log.info('Start testing BlockchainController')
  })
  describe('BlockchainController construction', () => {
    it('should be constructed without an error', () => {
      let blockchainController
      assert.doesNotThrow(() => {
        blockchainController = new BlockchainController()
        blockchainController = new BlockchainController({})
      })
      assert.deepEqual(blockchainController.clientArray, [])
    })
    it('should return correct client array', () => {
      const blockchainController =
        new BlockchainController({clientArray: [3, 4]})
      assert.deepEqual(blockchainController.getClientArray(), [3, 4])
    })
    it('should return correct client names', () => {
      const blockchainController =
        new BlockchainController({clientArray: [{connection: 'secret', target: 'AWS', chains: [{
          chainName: 'testChain',
          parameters: [],
        }]}]})
      assert.deepEqual(blockchainController.getClientInfos(), [{
        chainName: 'testChain',
        parameters: [],
        target: 'AWS',
      }])
    })
  })
  describe('BlockchainController starting', () => {

    it('should start server without error', () => {

    })

    it('should authenticate Client', () => {
      const blockchainController = new BlockchainController({
        port: 4343,
        log: {info: () => {}},
      })
      blockchainController.start()
      const ws = new WebSocket('ws://localhost:4343')
      ws.on('open', () => {
        ws.send('{"target": "myTestClient"}')
        setTimeout(() => {
          assert.equal(blockchainController.getClientArray().length, 1)
          assert(blockchainController.sendMessage({
            message: 'HI',
            target: 'myTestClient',
          }))
          setTimeout(() => {
            ws.close()
            setTimeout(() => {
              assert.equal(blockchainController.getClientArray().length, 0)
              blockchainController.stopServer()
            }, 100)
          }, 100)
        }, 100)
      })
    })

    it('should return false when no client exists to send a message to', () => {
      const blockchainController = new BlockchainController({
        port: 4545,
        log: {info: () => {}},
      })
      blockchainController.start()
      assert.equal(blockchainController.sendMessage({
        message: 'HI',
        target: 'iDoNotExist',
      }),
      false
      )
      blockchainController.stopServer()
    })
  })
  after(() => {
    log.info('End testing BlockchainController')

  })
})
