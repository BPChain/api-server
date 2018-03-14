const assert = require('assert')

const describe = require('mocha').describe
const it = require('mocha').it


const handleGetStatisticsFactory = require(
  '../../../../components/dataStorageAccessor/controller/handleGetStatisticsFactory',
)

const log = {
  trace: () => {},
}

describe('handleGetStatisticsFactory', () => {
  it('should return function when no parameters are supplied', () => {
    const route = handleGetStatisticsFactory()
    assert(typeof route === 'function')
  })
  it('should aggregate with startTime and endTime', async () => {
    const testStartTime = '2018-02-12'
    const testEndTime = '2018-02-13'
    const object = {
      numberOfHosts: 2,
      numberOfMiners: 2,
      avgHashrate: 2,
      avgBlocktime: 22,
      avgGasPrice: 22,
      avgDifficulty: 2,
      timeStamp: '2018-02-20',
    }
    const resultObject = {
      numberOfHosts: [2],
      numberOfMiners: [2],
      avgHashrate: [2],
      avgBlocktime: [22],
      avgGasPrice: [22],
      avgDifficulty: [2],
      timeStamp: ['2018-02-20'],
      chainName: 'ethereum',
    }
    const route = handleGetStatisticsFactory({
      aggregator: () => [object], log,
    })
    const response = []
    await route(
      {params: {chainName: 'ethereum'}, query: {startTime: testStartTime, endTime: testEndTime}},
      {send: data => response.push(data)},
    )
    assert.deepEqual(response[0], resultObject)
  })
  it('should aggregate with numberOfItems', async () => {

    const object = {
      numberOfHosts: 2,
      numberOfMiners: 2,
      avgHashrate: 2,
      avgBlocktime: 22,
      avgGasPrice: 22,
      avgDifficulty: 2,
      timeStamp: '2018-02-20',
    }
    const resultObject = {
      numberOfHosts: [2],
      numberOfMiners: [2],
      avgHashrate: [2],
      avgBlocktime: [22],
      avgGasPrice: [22],
      avgDifficulty: [2],
      timeStamp: ['2018-02-20'],
      chainName: 'ethereum',
    }

    const testNumberOfItems = 20
    const route = handleGetStatisticsFactory({
      aggregator: () => [object], log,
    })
    const response = []
    await route(
      {params: {chainName: 'ethereum'}, query: {numberOfItems: testNumberOfItems}},
      {send: data => response.push(data)},
    )
    assert.deepEqual(response[0], resultObject)
  })
  it('should aggregate with default values if nothing is supplied', async () => {

    const object = {
      numberOfHosts: 2,
      numberOfMiners: 2,
      avgHashrate: 2,
      avgBlocktime: 22,
      avgGasPrice: 22,
      avgDifficulty: 2,
      timeStamp: '2018-02-20',
    }
    const resultObject = {
      numberOfHosts: [2],
      numberOfMiners: [2],
      avgHashrate: [2],
      avgBlocktime: [22],
      avgGasPrice: [22],
      avgDifficulty: [2],
      timeStamp: ['2018-02-20'],
      chainName: 'ethereum',
    }

    const route = handleGetStatisticsFactory({
      aggregator: () => [object],
      log,
    })
    const response = []
    await route({params: {chainName: 'ethereum'}, query: {}}, {send: data => response.push(data)})
    assert.deepEqual(response[0], resultObject)
  })
})
