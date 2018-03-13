const assert = require('assert')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const accessNanopool = require(
  '../../../../../components/publicChainDataCollector/model/ethereum/accessNanopool'
)
const log = console

describe('Access Nanopool', () => {
  before(() => {
    log.info('Start testing accessNanopool')
  })
  describe('accessNanopool returns correct type', () => {
    it('should return correct value if api is reachable', () => {
      accessNanopool({
        config: {
          ethereum: {
            publicChain: {
              activeMiners: 'https://api.nanopool.org/v1/eth/pool/activeminers',
            },
          },
        },
        log: {info: () => {}, warn: () => {}},
        field: 'activeMiners',
      })
        .then(result => {
          assert.equal(typeof result, 'number')
        })
    })
    it('should return 0 if api is not reachable', () => {
      accessNanopool({
        config: {ethereum: {publicChain: {activeMiners: 'This link does not exist'}}},
        log: {info: () => {}, warn: () => {}},
        field: 'activeMiners',
      })
        .then(result => {
          assert.equal(result, 0)
        })
    })
  })
  after(() => {
    log.info('End testing accessNanopool')
  })
})
