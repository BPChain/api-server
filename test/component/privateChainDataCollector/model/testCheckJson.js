const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')

const isValidJson = require(
  '../../../../components/privateChainDataCollector/model/checkJsonContent'
)

describe('privateChains', () => {
  describe('#checkJson()', () => {
    it('should throw an Error when no options are provided', () => {
      assert.throws(() => {
        isValidJson()
      },
      TypeError,
      )
    })
    it('should throw Error when object is not valid', () => {
      assert.throws(() => {
        isValidJson('IAmNotJSObject')
      },
      'Error: Missing key in backend JSON: chainName',
      )
    })
    it('should throw Error when object is empty', () => {
      assert.throws(() => {
        isValidJson({})
      },
      'Error: Missing key in backend JSON: chainName',
      )
    })
    it('should throw Error when object is missing fields', () => {
      assert.throws(() => {
        isValidJson({hostId: 'anId'})
      },
      'Error: Missing key in backend JSON: chainName',
      )
    })
    it('should return false when object has bad types', () => {
      assert.equal(
        isValidJson({
          'chainName': 'ethereum',
          'hostId': 'abc',
          'isMining': 'false',
          'hashrate': '45',
          'avgBlocktime': '64',
          'blockSize': 533,
          'avgDifficulty': 56,
          'cpuUsage': 'fff',
          'avgTransactions': 'wwwfew',
        }),
        false,
      )
    })
    it('should return true when object is as expected', () => {
      assert.equal(
        isValidJson({
          'chainName': 'ethereum',
          'hostId': 'abc',
          'isMining': 1,
          'hashrate': 45,
          'avgBlocktime': 64,
          'blockSize': 533,
          'avgDifficulty': 56,
          'cpuUsage': 333,
          'avgTransactions': 444,
        }),
        true,
      )
    })
  })
})
