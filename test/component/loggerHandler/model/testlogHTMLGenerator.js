const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it
const path = require('path')

const fse = require('fs-extra')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const htmlGenerator = require(
  '../../../../components/loggerHandler/model/logHTMLGenerator'
)

const logObjects = [
  {
    timeStamp: 0,
    log: 'A non classified log',
    logLevel: 2,
  },
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
  it('should throw an error when no data is supplied', () => {
    return expect(htmlGenerator).to.throw(TypeError)
  })
  describe('logHTMLGenerator', () => {
    it('should generate correct logs for all logLevels', () => {
      const html = htmlGenerator({data: logObjects})
      assert.equal(html, testHTMLOutput)
    })
  })
})
