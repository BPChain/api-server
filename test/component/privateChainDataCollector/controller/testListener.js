const WebSocket = require('ws')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const privateChainCollector = require(
  '../../../../components/privateChainDataCollector/controller/listener'
)
const config = require('../../../../config')

const log = console

describe('privateChainDataCollector', () => {
  before(() => {
    log.info('Start testing listener')
  })
  describe('listener', () => {
    it('should return correct object without error', () => {

      const controller = privateChainCollector({
        activeChain: {get: () => {
          return 'ethereum'
        }},
        log: console,
        config,
        connection: { model: () => 'testModel' },
      })

      controller.then(result => {
        assert.deepEqual(Object.keys(result), ['wsServer', 'doubleBuffer'])
        result.doubleBuffer.stopBufferInterval()
      })
    })

    const errorLog = []
    const controller = privateChainCollector({
      activeChain: {get: () => {
        return 'ethereum'
      }},
      log: {
        trace: () => {},
        debug: () => {},
        warn: () => {},
        info: () => {},
        error: (message) => {
          errorLog.push(message)
        },
      },
      config,
      connection: {model: () => {
        return class Buffer {
          save () {}
          aggregate () {}
        }
      },
      },
    })

    it('should send 415 on invalid JSON', () => {
      controller.then(result => {
        result.doubleBuffer.stopBufferInterval()
        const ws = new WebSocket('ws://localhost:3030')
        ws.on('open', () => {
          ws.send('}{')
          ws.on('message', (message) => {
            assert.equal(message, 415)
            assert.equal(
              errorLog[0],
              'While receiving private data: Error: JSON has wrong content: }{'
            )
          })
        })
      })
    })
    it('should send 200 on valid JSON', () => {
      return controller.then(result => {
        result.doubleBuffer.stopBufferInterval()
        const ws2 = new WebSocket('ws://localhost:3030')
        ws2.on('open', () => {
          ws2.send(JSON.stringify({
            'chainName': 'ethereum',
            'hostId': 'abc',
            'isMining': 1,
            'hashrate': 45,
            'avgBlocktime': 64,
            'gasPrice': 533,
            'avgDifficulty': 56,
          }))
          ws2.on('message', (message) => {
            assert.equal(message, 200)
            result.wsServer.close()
          })
        })
      })
    })
  })
  after(() => {
    log.info('End testing listener')
  })
})
