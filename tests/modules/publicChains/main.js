const assert = require('assert')

const chainValueCollector = require(
  '../../../components/publicChains/chainValueCollector'
)

const log = console

module.exports = async () => {
  log.info('Start testing public chains')

  const result = await chainValueCollector({chainName: 'ethereum'})
  const expectedKeys = [
    'avgBlocktime',
    'avgHashrate',
    'numberOfMiners',
    'numberOfWorkers',
    'timeToNextEpoch',
    'timeStamp',
    'chain',
  ]

  assert.deepEqual(Object.keys(result), expectedKeys)

  log.info('End testing public chains')
}
