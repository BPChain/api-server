const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const nanopoolCaller = require(
  '../../../../components/publicChainDataCollector/controller/nanopoolCaller'
)

const config = require('../../../../config')

describe('nanopoolCaller', () => {
  describe('Creation', async () => {
    it('should log error when saving is not possible', () => {
      const intervalId = nanopoolCaller({
        chainName: 'test',
        schema: 'test',
        connection: {
          model: () => {
            return class A {
              constructor () {}
              save (callbackFunction) {
                callbackFunction(true, false)
              }
            }
          },
        },
        config: Object.assign(config, {publicPollTime: 100}),
        log: {
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: (errorMessage) => {
            assert.equal(errorMessage, 'Could not store dataLine: true')
          },
        },
      })
      setTimeout(() => {
        clearInterval(intervalId)
      }, 190)
    })
    it('should log status if storing was successful', () => {
      const intervalId = nanopoolCaller({
        chainName: 'test',
        schema: 'test',
        connection: {
          model: () => {
            return class A {
              constructor () {}
              save (callbackFunction) {
                callbackFunction(false, true)
              }
            }
          },
        },
        config: Object.assign(config, {publicPollTime: 100}),
        log: {
          debug: () => {},
          info: (info) => {
            assert.equal(info, 'Successfully stored aggregated public data.')
          },
          warn: () => {},
          error: () => {},
        },
      })
      setTimeout(() => {
        clearInterval(intervalId)
      }, 190)
    })
  })
})
