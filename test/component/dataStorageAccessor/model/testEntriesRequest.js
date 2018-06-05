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
const entriesRequest = dataRequests.entriesRequest


describe('EntriesRequest', () => {
  const mockCollection = {
    find: () => mockCollection,
    limit: () => mockCollection,
    sort: () => mockCollection,
    toArray: () => mockCollection,
    reverse: () => [1],
  }
  it('should throw an error when no options are supplied', () => {
    return expect(entriesRequest()).to.eventually.be.rejectedWith(TypeError)
  })
  it('should execute without throwing an error', () => {
    assert.doesNotThrow(() => {
      entriesRequest({
        numberOfItems: -2,
        connection: {
          db: {
            collection: () => {
              return mockCollection
            },
          },
        },
      })
        .then(data => {
          assert.equal(data.length, 1)
        })
    })
    assert(typeof entriesRequest === 'function')
  })
})
