/* eslint no-unused-vars: 0 */
const entriesRequest = require('./entriesRequest')
const timespanRequest = require('./timespanRequest')
const resultReducer = require('./resultReducer')

module.exports = async (options = {}) => {
  const {
    chainName,
    accessibility,
    connection,
    startTime,
    endTime,
    numberOfItems,
  } = options

  let lines = []

  if (startTime && endTime) {
    lines = await resultReducer({
      lines: await timespanRequest(options),
      numberOfItems,
    })
  }
  else {
    lines = await entriesRequest(options)
  }

  return lines.map(line => Object.assign(line, {chainName}))
}
