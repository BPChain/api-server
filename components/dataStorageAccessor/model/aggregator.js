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

  // noinspection UnnecessaryLocalVariableJS
  const dataLine = lines.map((line) => Object.assign(line, {chainName}))
  return dataLine
}
