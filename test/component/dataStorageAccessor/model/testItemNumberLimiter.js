const assert = require('assert')

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after

const itemNumberLimiter = require(
  '../../../../components/dataStorageAccessor/model/itemNumberLimiter',
)

const log = console

describe('ItemNumberLimiter', () => {
  before(() => {
    log.info('Start testing ItemNumberLimiter')
  })
  it('should execute without throwing an error', () => {
    assert.doesNotThrow(() => {
      itemNumberLimiter()
    })
    assert(typeof itemNumberLimiter === 'function')
  })
  it('should return min for negative values', () => {
    assert.equal(itemNumberLimiter(-5), 1)
  })
  it('should return min for zero value', () => {
    assert.equal(itemNumberLimiter(0), 1)
  })
  it('should return value for value between min and max', () => {
    assert.equal(itemNumberLimiter(50), 50)
  })
  it('should return max for value greater than max', () => {
    assert.equal(itemNumberLimiter(1000000), 10000)
  })

  after(() => {
    log.info('End testing ItemNumberLimiter')
  })
})
