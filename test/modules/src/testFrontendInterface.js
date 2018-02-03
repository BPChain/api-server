const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const frontendInterface = require(
  '../../../interface/frontend/frontendInterface'
)

const log = console

let app
describe('publicChains', () => {
  before(() => {
    log.info('Start testing frontend interface')
  })
  describe('frontendInterface', () => {
    it('should not throw an error', (done) => {
      app = frontendInterface()
      assert.ok(app)
      done()
    })
  })
  after(() => {
    app.close()
    log.info('End testing frontend interface')
  })
})
