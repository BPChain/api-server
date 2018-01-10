const isodate = require('isodate')

module.exports = async (options = {}) => {
  let {numberOfItems} = options
  const {
    chainName,
    connection,
    startTime,
    endTime,
  } = options

  const result = await connection.db
    .collection(`${chainName}_private_storages`)

  let data
  let lines = []
  let reducedLines = []

  if (startTime && endTime) {
    lines = await result
      .find({
        timeStamp: {
          $gte: isodate(startTime),
          $lt: isodate(endTime),
        },
      })
      .toArray()

    if (!numberOfItems) {
      numberOfItems = 100
    }

    if (lines.length < numberOfItems) {
      reducedLines = lines
    }
    else {
      const nthLine = parseInt(lines.length / numberOfItems, 10) + 1
      reducedLines = lines.filter((value, index) => {
        return index % nthLine === 0
      })
    }

  }
  else {
    data = await result
      .find({})
      .toArray()

    lines = data.slice(Math.max(data.length - numberOfItems, 1))
  }

  if (reducedLines.length) {
    lines = reducedLines
  }

  const dataLine = lines.map((line) => {
    return Object.assign(line, {chain: chainName})
  })

  return dataLine
}
