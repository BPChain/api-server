const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const DoubleBuffer = require(
  '../../../../components/privateChainDataCollector/model/doubleBuffer'
)

const log = console

describe('privateChains', () => {
  before(() => {
    log.info('Start testing private chains')
  })
  describe('#doubleBuffer()', () => {
    it(
      'should should construct without error',
      () => {
        assert.doesNotThrow(() => {
          const doubleBuffer = new DoubleBuffer({
            connection: {model: () => 'model'},
            activeChain: {getChains: () => { }},
            config: {bufferSwitchTime: 1000},
          })
          assert.ok(doubleBuffer)
          doubleBuffer.stopBufferInterval()
        })
      }
    )
    it(
      'should return correct activeBuffer',
      () => {
        const doubleBuffer = new DoubleBuffer({
          connection: {model: () => 'testModel'},
          activeChain: {getChains: () => { }},
          config: {bufferSwitchTime: 100},
        })
        assert.equal(doubleBuffer.getActiveBuffer(), 'testModel')
        doubleBuffer.stopBufferInterval()
      }
    )
    it(
      'should return correct buffer labels',
      () => {
        const doubleBuffer = new DoubleBuffer({
          connection: {model: () => 'testModel'},
          activeChain: {getChains: () => { }},
          config: {bufferSwitchTime: 10000},
        })
        assert.equal(doubleBuffer.getActiveBufferLabel(), 'a')
        assert.equal(doubleBuffer.getInactiveBufferLabel(), 'b')
        doubleBuffer.stopBufferInterval()
      }
    )
    it(
      'should toggle buffers correctly',
      () => {
        const doubleBuffer = new DoubleBuffer({
          connection: {model: (name) => name},
          activeChain: {getChains: () => { }},
          log: {trace: () => { }},
          config: {bufferSwitchTime: 10000},
        })
        assert.equal(doubleBuffer.getActiveBufferLabel(), 'a')
        assert.equal(doubleBuffer.getInactiveBufferLabel(), 'b')
        assert.equal(doubleBuffer.getActiveBuffer(), 'common_private_buffer_a')
        doubleBuffer.toggleActiveBuffer()
        assert.equal(doubleBuffer.getActiveBufferLabel(), 'b')
        assert.equal(doubleBuffer.getInactiveBufferLabel(), 'a')
        assert.equal(doubleBuffer.getActiveBuffer(), 'common_private_buffer_b')
        doubleBuffer.stopBufferInterval()
      }
    )
    it(
      'should call storeIncomingData correctly',
      () => {
        const doubleBuffer = new DoubleBuffer({
          connection: {
            model: () => {
              return class MockClass {
                constructor () {
                  this.privateData
                }
                save () {}
              }
            },
          },
          activeChain: {getChains: () => { }},
          log: {debug: () => { }},
          config: {bufferSwitchTime: 1000},
        })
        assert.doesNotThrow(() => {
          doubleBuffer.storeIncomingData()
        })
        doubleBuffer.stopBufferInterval()
      }
    )
  })
  after(() => {
    log.info('End testing privateChains')
  })
})
