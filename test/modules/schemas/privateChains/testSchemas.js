const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const expect = require('chai').expect
const Schema = require('mongoose').Schema

const ethereumSchema = require(
  '../../../../schemas/privateChains/ethereumSchema'
)
const compareEthereumSchema = new Schema({
  hostId: {type: String},
  isMining: {type: Number},
  hashrate: {type: Number},
  avgBlocktime: {type: Number},
  gasPrice: {type: Number},
  avgDifficulty: {type: Number},
})

const ethereumStorage = require(
  '../../../../schemas/privateChains/ethereumStorage'
)
const compareStorageSchema = new Schema({
  chain: {type: String},
  timeStamp: {type: Date},
  numberOfHosts: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  avgGasPrice: {type: Number},
  avgDifficulty: {type: Number},
})
const log = console

describe('publicChains', () => {
  before(() => {
    log.info('Start testing private chain schemas')
  })
  describe('ethereumSchema', () => {
    it('should return valid ethereum schema', (done) => {
      expect(ethereumSchema()).to.deep.equal(compareEthereumSchema)
      done()
    })
  })
  describe('ethereumStorage', () => {
    it('should return valid ethereum storage', (done) => {
      expect(ethereumStorage()).to.deep.equal(compareStorageSchema)
      done()
    })
  })
  after(() => {
    log.info('End testing private chain schemas')
  })
})