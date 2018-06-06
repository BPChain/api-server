const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it
const scyllaParser = require(
  '../../../../components/scyllaLogParser/model/scyllaParser'
)

const testLogs = require('./testLogs')

describe('scyllaLogParser', () => {

  describe('scyllaParser', () => {
    it('should return expected parsing results', () => {
      const parsingResult = scyllaParser(testLogs.expectedInput)
      const expectedResult = testLogs.expectedResult
      assert.equal(JSON.stringify(parsingResult), JSON.stringify(expectedResult))
    })
    it('should throw an exception when the log is faulty', () => {
      assert.throws(() => {
        scyllaParser(testLogs.unexpectedInput)
      }, TypeError)
    })
  })
})
