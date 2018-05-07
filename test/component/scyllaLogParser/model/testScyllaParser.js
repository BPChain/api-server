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
      assert.deepEqual(parsingResult, expectedResult)
    })
  })
})
