const assert = require('assert')
const describe = require('mocha').describe

const it = require('mocha').it

const logSchema = require(
  '../../../../components/loggerHandler/model/schema'
)

describe('schemas', () => {
  describe('log', () => {
    it('should be created with no error', (done) => {
      const result = logSchema
      assert(result.obj.log)
      assert(result.obj.logLevel)
      assert(result.obj.timeStamp)

      done()
    })
  })
})
