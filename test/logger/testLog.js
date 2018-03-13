const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const logSchema = require(
  '../../logger/schema'
)

const log = console

describe('schemas', () => {
  before(() => {
    log.info('Start testing logSchema')
  })
  describe('log', () => {
    it('should be created with no error', (done) => {
      const result = logSchema
      assert(result.obj.log)
      assert(result.obj.logLevel)
      assert(result.obj.timeStamp)

      done()
    })
  })
  after(() => {
    log.info('End testing log HTML Generator')
  })
})
