const request = require('./request')
const timeRequest = require('./timeRequest')
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
      lines: await timeRequest({
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
    lines = await request({
      chainName,
      accessibility,
      connection,
      numberOfItems,
    })
  }

  const dataLine = lines.map((line) => {
    return Object.assign(line, {chain: chainName})
  })

  return dataLine
}
