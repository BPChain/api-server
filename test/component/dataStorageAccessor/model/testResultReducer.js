const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

const dataRequests = require(
  '../../../../components/dataStorageAccessor/model/dataRequests',
)
const resultReducer = dataRequests.resultReducer


const mockArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe('dbRequests', () => {
  describe('#resultReducer()', () => {
    it('should throw an error when no lines are supplied', () => {
      return expect(resultReducer()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return 10 items if 10 items are requested', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArray,
          numberOfItems: 10,
        })).length,
        10,
      )
    })
    it('should return <= 6 items if 6 items are requested', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArray,
          numberOfItems: 6,
        })).length <= 6,
        true,
      )
    })
    it('should return all items if numberOfItems > items.length', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArray,
          numberOfItems: 15,
        })).length,
        10,
      )
    })
    it('should return less than 10k items if numberOfItems > 10k', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArray,
          numberOfItems: 15000,
        })).length <= 10000,
        true,
      )
    })
  })
})
