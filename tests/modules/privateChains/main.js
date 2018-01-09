const assert = require('assert')

const checkJsonContent = require(
  '../../../components/privateChains/checkJsonContent'
)

const log = console

module.exports = async () => {
  log.info('Start testing private chains')
  const fakeLog = {    
    error: () => {},
  }
  // No valid JSON
  assert.equal(
    checkJsonContent({json: 'IAmNotAJsonString', log: fakeLog}),
    false,
  )
  // Empty JSON
  assert.equal(
    checkJsonContent({json: {}, log: fakeLog}),
    false,
  )
  // Missing fields
  assert.equal(
    checkJsonContent({json: {hostId: 'anId'}, log: fakeLog}),
    false,
  )
  // Bad JSON types fields
  assert.equal(
    checkJsonContent({
      json: {
        'hostId': 'abc',
        'isMining': 'false',
        'hashrate': '45',
        'avgBlocktime': '64',
        'gasPrice': 533,
        'avgDifficulty': 56,
      },
      log: fakeLog}),
    false,
  )
  // Correct JSON request
  assert.equal(
    checkJsonContent({
      json: {
        'hostId': 'abc',
        'isMining': 1,
        'hashrate': 45,
        'avgBlocktime': 64,
        'gasPrice': 533,
        'avgDifficulty': 56,
      },
      log: fakeLog}),
    true,
  )
  log.info('End testing public chains')
}
