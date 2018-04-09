const assert = require('assert')
const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const bufferAggregator = require(
  '../../../../components/privateChainDataCollector/model/bufferAggregator'
)

const log = console

const callbackValues = {error: false, data: true}

const model = () => {
  return class Storage {
    static aggregate ()  {
      return {
        exec: () => {
          return []
        },
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
    error: () => {},
  },
}

describe('privateChains', () => {
  before(() => {
    log.info('Start testing bufferAggregator')
  })
  describe('bufferAggregator',  () => {
    it('should throw an error when no options are supplied', async () => {
      return expect(bufferAggregator()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return undefined on correct behaviour', async () => {
      const result = await bufferAggregator(options)
      assert.equal(result, undefined)
    })

    it('should throw an error when saving failes', async () => {
      callbackValues.error = new Error('testError')
      await bufferAggregator(options)
        .catch(error => {
          assert.equal(error, 'Error: testError')
        })
    })
  })
  after(() => {
    log.info('End testing bufferAggregator')
  })
})
