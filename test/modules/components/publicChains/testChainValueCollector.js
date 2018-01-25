const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const expect = require('chai').expect
const chainValueCollector = require(
  '../../../../components/publicChains/chainValueCollector'
)

const log = console

describe('publicChains', () => {
  before(() => {
    log.info('Start testing public chains')
  })
  describe('chainValueCollector', () => {
    it('should have only the expected keys', (done) => {
      const expectedKeys = [
        'avgBlocktime',
        'avgHashrate',
        'numberOfMiners',
        'numberOfWorkers',
        'timeToNextEpoch',
        'timeStamp',
        'chain',
      ]
      chainValueCollector({chainName: 'ethereum'})
        .then(result => {
          expect(Object.keys(result)).to.deep.equal(expectedKeys)
          done()
        })
    })
  })
  after(() => {
    log.info('End testing public chains')
  })
})
