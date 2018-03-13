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
    const route = handleGetStatisticsFactory({
      aggregator: ({startTime, endTime}) => `${startTime}-${endTime}`, log,
    })
    const response = []
    await route(
      {params: {}, query: {startTime: testStartTime, endTime: testEndTime}},
      {send: data => response.push(data)},
    )
    assert.equal(response[0], `${testStartTime}-${testEndTime}`)
  })
  it('should aggregate with numberOfItems', async () => {
    const testNumberOfItems = 20
    const route = handleGetStatisticsFactory({
      aggregator: ({numberOfItems}) => numberOfItems * 20, log,
    })
    const response = []
    await route(
      {params: {}, query: {numberOfItems: testNumberOfItems}},
      {send: data => response.push(data)},
    )
    assert.equal(response[0], 400)
  })
  it('should aggregate with default values if nothing is supplied', async () => {
    const route = handleGetStatisticsFactory({
      log,
      aggregator: ({numberOfItems, startTime, endTime}) =>
        `${numberOfItems}_${startTime}_${endTime}`,
    })
    const response = []
    await route({params: {}, query: {}}, {send: data => response.push(data)})
    assert.equal(response[0], '1_false_false')
  })
})
