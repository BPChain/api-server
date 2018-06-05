const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it

const dataRequests = require(
  '../../../../components/dataStorageAccessor/model/dataRequests',
)
const itemNumberLimiter = dataRequests.itemNumberLimiter

describe('ItemNumberLimiter', () => {
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
})
