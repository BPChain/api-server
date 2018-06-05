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
const aggregator = dataRequests.aggregator

describe('Aggregator', () => {
  it('should throw an error when no options are supplied', () => {
    return expect(aggregator()).to.eventually.be.rejectedWith(TypeError)
  })

  it('should do a timeSpan request if startTime and endTime are provided', async () => {
    const mockCollection = {
      find: () => mockCollection,
      limit: () => mockCollection,
      sort: () => mockCollection,
      toArray: () => mockCollection,
      filter: () => mockCollection,
      map: () => [1, 2, 3],
    }
    const result = await aggregator({
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
    assert.deepEqual(result, [1, 2, 3])
  })
  it('should do an entries request if numberOfItems is provided', async () => {
    const mockCollection = {
      find: () => mockCollection,
      limit: () => mockCollection,
      sort: () => mockCollection,
      toArray: () => mockCollection,
      filter: () => mockCollection,
      reverse: () => mockCollection,
      map: () => [4, 5, 6],
    }
    const result = await aggregator({
      connection: {
        db: {
          collection: () => {
            return mockCollection
          },
        },
      },
      numberOfItems: 20,
    })
    assert.deepEqual(result, [4, 5, 6])
  })
})
