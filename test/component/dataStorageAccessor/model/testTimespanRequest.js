const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const dataRequests = require(
  '../../../../components/dataStorageAccessor/model/dataRequests',
)
const timespanRequest = dataRequests.timespanRequest

describe('TimespanRequest', () => {
  const mockCollection = {
    find: () => mockCollection,
    toArray: () => mockCollection,
    timeStamp: {},
  }
  it('should throw an error when no parameters are supplied', () => {
    return expect(timespanRequest()).to.eventually.be.rejectedWith(TypeError)
  })
  it('should execute without throwing an error', () => {
    assert.doesNotThrow(() => {
      timespanRequest({
        connection: {
          db: {
            collection: () => {
              return mockCollection
            },
          },
        },
        startTime: '2012-09-27',
        endTime: '2012-09-27',
      })
    })
    assert(typeof timespanRequest === 'function')
  })
})
