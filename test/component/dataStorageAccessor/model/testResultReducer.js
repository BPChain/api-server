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

const objectA = {
  numberOfHosts: 2,
  numberOfMiners: 2,
  avgHashrate: 2,
  avgBlocktime: 2,
  avgBlockSize: 2,
  avgDifficulty: 2,
  avgCpuUsage: 2,
}

const objectB = {
  numberOfHosts: 1,
  numberOfMiners: 1,
  avgHashrate: 1,
  avgBlocktime: 1,
  avgBlockSize: 1,
  avgDifficulty: 1,
  avgCpuUsage: 1,
}

const mockArrayB = [objectA, objectB, objectA, objectB, objectA,
  objectB, objectA, objectB, objectA, objectB]

const mockArrayC = [objectA, objectB, objectA, objectB, objectA,
  objectB, objectA, objectB, objectA, objectB, objectA, objectB,
  objectA, objectB, objectA, objectB, objectA, objectB, objectA, objectB]

const mockArrayD = [objectA, objectB, objectA, objectB, objectA,
  objectB, objectA, objectA, objectA, objectB, objectA]

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
          lines: mockArrayB,
          numberOfItems: 10,
        })).length,
        10,
      )
    })
    it('should return 6 items if 6 items are requested', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArrayB,
          numberOfItems: 6,
        })).length,
        6,
      )
    })
    it('should return all items if numberOfItems > items.length', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArrayB,
          numberOfItems: 15,
        })).length,
        10,
      )
    })
    it('should return correct average', async () => {
      assert.equal(
        (await resultReducer({
          lines: mockArrayC,
          numberOfItems: 10,
        })).length,
        10,
      )
      assert.equal(
        (await resultReducer({
          lines: mockArrayD,
          numberOfItems: 10,
        })).length,
        10,
      )
      assert.equal(
        (await resultReducer({
          lines: mockArrayD,
          numberOfItems: 7,
        })).length,
        7,
      )
      assert.equal(
        (await resultReducer({
          lines: mockArrayD,
          numberOfItems: 1,
        })).length,
        1,
      )
      assert.equal(
        (await resultReducer({
          lines: mockArrayC,
          numberOfItems: 1,
        })).length,
        1,
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
