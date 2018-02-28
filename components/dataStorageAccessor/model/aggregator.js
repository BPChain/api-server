const entriesRequest = require('./entriesRequest')
const timespanRequest = require('./timespanRequest')
const resultReducer = require('./resultReducer')

module.exports = async (options = {}) => {
  const {numberOfItems} = options
  const {
    chainName,
    accessibility,
    connection,
    startTime,
    endTime,
  } = options

  let lines = []

  if (startTime && endTime) {
    lines = await resultReducer({
      lines: await timespanRequest({
        chainName,
        accessibility,
        connection,
        startTime,
        endTime,
      }),
      numberOfItems,
    })
  }
  else {
    lines = await entriesRequest({
      chainName,
      accessibility,
      connection,
      numberOfItems,
    })
  }

  const dataLine = lines.map((line) => Object.assign(line, {chain: chainName}))
  return dataLine
}
