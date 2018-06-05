const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Schema = require('mongoose').Schema

const ethereumSchema = require(
  '../../../../components/privateChainDataCollector/model/ethereumSchema'
)
const compareEthereumSchema = new Schema({
  hostId: {type: String},
  chainName: {type: String},
  target: {type: String},
  isMining: {type: Number},
  hashrate: {type: Number},
  avgBlocktime: {type: Number},
  blockSize: {type: Number},
  avgDifficulty: {type: Number},
  cpuUsage: {type: Number},
  avgTransactions: {type: Number},
})

const ethereumStorage = require(
  '../../../../components/privateChainDataCollector/model/ethereumStorage'
)
const compareStorageSchema = new Schema({
  chainName: {type: String},
  target: {type: String},
  timeStamp: {type: Date},
  numberOfHosts: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  avgBlockSize: {type: Number},
  avgDifficulty: {type: Number},
  avgCpuUsage: {type: Number},
  avgTransactions: {type: Number},
})

describe('privateChains', () => {
  describe('ethereumSchema', () => {
    it('should return valid ethereum schema', (done) => {
      expect(ethereumSchema).to.deep.equal(compareEthereumSchema)
      done()
    })
  })
  describe('ethereumStorage', () => {
    it('should return valid ethereum storage', (done) => {
      expect(ethereumStorage).to.deep.equal(compareStorageSchema)
      done()
    })
  })
})
