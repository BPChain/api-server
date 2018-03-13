const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const expect = require('chai').expect
const Schema = require('mongoose').Schema

const ethereumStorage = require(
  '../../../../components/publicChainDataCollector/model/ethereumStorage'
)
const compareEthereumStorage = new Schema({
  chain: {type: String},
  timeStamp: {type: Date},
  numberOfWorkers: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  timeToNextEpoch: {type: Number},
})

const log = console

describe('publicChains', () => {
  before(() => {
    log.info('Start testing public chain schemas')
  })
  describe('ethereumStorage', () => {
    it('should return valid ethereum storage', (done) => {
      expect(ethereumStorage).to.deep.equal(compareEthereumStorage)
      done()
    })
  })
  after(() => {
    log.info('End testing public chain schemas')
  })
})
