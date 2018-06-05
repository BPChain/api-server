const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const accessNanopool = require(
  '../../../../../components/publicChainDataCollector/model/ethereum/accessNanopool'
)

describe('Access Nanopool', () => {
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
})
