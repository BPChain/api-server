const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const path = require('path')

const fse = require('fs-extra')
const htmlGenerator = require(
  '../../logger/logHTMLGenerator'
)

const log = console

const logObjects = [
  {
    timeStamp: 0,
    log: 'A trace log',
    logLevel: 10,
  },
  {
    timeStamp: 1,
    log: 'A debug log',
    logLevel: 20,
  },
  {
    timeStamp: 2,
    log: 'A info log',
    logLevel: 30,
  },
  {
    timeStamp: 3,
    log: 'A warn log',
    logLevel: 40,
  },
  {
    timeStamp: 4,
    log: 'A error log',
    logLevel: 50,
  },
  {
    timeStamp: 5,
    log: 'A fatal log',
    logLevel: 60,
  },
]
const testHTMLOutput = fse
  .readFileSync(
    path.join(__dirname, './testHTMLOutput.html'),
    'UTF-8',
  )
describe('publicChains', () => {
  before(() => {
    log.info('Start testing log HTML Generator')
  })
  describe('logHTMLGenerator', () => {
    it('should generate correct logs for all logLevels', (done) => {
      const html = htmlGenerator({data: logObjects})
      assert.equal(html, testHTMLOutput)
      done()
    })
  })
  after(() => {
    log.info('End testing log HTML Generator')
  })
})