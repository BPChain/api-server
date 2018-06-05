const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const bufferAggregator = require(
  '../../../../components/privateChainDataCollector/model/bufferAggregator'
)

const callbackValues = {error: false, data: true}

let resultList = [1]
const model = () => {
  return class Storage {
    static aggregate ()  {
      return {
        exec: () => resultList,
      }
    }
    lines () {}
    save (callbackFunction)  {
      callbackFunction(callbackValues.error, callbackValues.data)
    }
    static get collection () {
      return {
        find: () => {
          return {
            limit: () => {
              return {
                sort: () => {},
              }
            },
          }
        },
        remove: () => {},
      }
    }
  }
}

const options = {
  chainName: 'ethereum',
  target: 'testTarget',
  filledBuffer: {},
  Schema: 'Schema',
  StorageSchema: 'StorageSchema',
  connection: {
    model,
  },
  log: {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {},
  },
}

describe('privateChains', () => {
  describe('bufferAggregator',  () => {
    it('should throw an error when no options are supplied', async () => {
      return expect(bufferAggregator()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return undefined on correct behaviour', async () => {
      const result = await bufferAggregator(options)
      assert.equal(result, undefined)
    })
    it('should throw an error when saving failes', async () => {
      resultList = []
      await bufferAggregator(options)
        .catch(error => {
          assert.equal(error, 'Error: Can not aggregate ethereum testTarget hashrate')
        })
    })
  })
})
