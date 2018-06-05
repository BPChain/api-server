const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Schema = require('mongoose').Schema

const ethereumStorage = require(
  '../../../../components/publicChainDataCollector/model/commonStorage'
)
const compareEthereumStorage = new Schema({
  chainName: {type: String},
  timeStamp: {type: Date},
  numberOfWorkers: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  timeToNextEpoch: {type: Number},
})

describe('publicChains', () => {
  describe('ethereumStorage', () => {
    it('should return valid ethereum storage', (done) => {
      expect(ethereumStorage).to.deep.equal(compareEthereumStorage)
      done()
    })
  })
})
