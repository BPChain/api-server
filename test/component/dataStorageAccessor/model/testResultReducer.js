const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect


const resultReducer = require(
  '../../../../components/dataStorageAccessor/model/resultReducer'
)

const log = console

const mockArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe('dbRequests', () => {
  before(() => {
    log.info('Start testing database requests')
  })
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
  after(() => {
    log.info('End testing database requests')
  })
})
