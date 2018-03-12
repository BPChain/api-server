const assert = require('assert')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const timespanRequest = require(
  '../../../../components/dataStorageAccessor/model/timespanRequest',
)

const log = console

describe('TimespanRequest', () => {
  before(() => {
    log.info('Start testing TimespanRequest')
  })
  const mockCollection = {
    find: () => mockCollection,
    toArray: () => mockCollection,
    timeStamp: {},
  }
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
  after(() => {
    log.info('End testing TimespanRequest')
  })
})

