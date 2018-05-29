const assert = require('assert')
const describe = require('mocha')
  .describe
const it = require('mocha')
  .it

const frontendInterface = require(
  '../../components/frontendRouting.js'
)
const config = require('../../config.js')
const log = console

/* eslint-disable no-unused-vars */

process.env.FRONTEND_ADMIN = 'some'
process.env.FRONTEND_ADMIN_PASSWORD = 'abc'

const connection = {
  model: (string, type) => {
    return class User {
      static findOne (object, callbackFunction) {
        callbackFunction(false, false)
      }
      static findOneAndUpdate (query, user, opts, callbackFunction) {
        callbackFunction(false, true)
      }
      lines () { }
      save () { }
    }
  },
}

const ActiveChains = require('../../components/privateChainDataCollector/model/ActiveChains')
const activeChains = new ActiveChains({config, connection, log})

describe('publicChains', () => {
  describe('frontendInterface', () => {
    it('should not throw an error', (done) => {
      const stop = frontendInterface({log, connection, activeChains})
      stop()
      done()
    })
  })
})
