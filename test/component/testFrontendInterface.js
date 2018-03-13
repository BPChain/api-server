const assert = require('assert')
const describe = require('mocha')
  .describe
const before = require('mocha')
  .before
const it = require('mocha')
  .it
const after = require('mocha')
  .after

const frontendInterface = require(
  '../../components/frontendRouting.js'
)

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

let app
describe('publicChains', () => {
  before(() => {
    log.info('Start testing frontend interface')
  })
  describe('frontendInterface', () => {
    it('should not throw an error', (done) => {
      app = frontendInterface({log, connection})
      assert.ok(app)
      done()
    })
  })
  after(() => {
    app.close()
    log.info('End testing frontend interface')
  })
})
