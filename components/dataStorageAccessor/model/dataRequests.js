const isodate = require('isodate')

module.exports.itemNumberLimiter = (numberOfItems) => Math.min(10000, Math.max(1, numberOfItems))

module.exports.entriesRequest = async (options = {}) => {
  let {numberOfItems} = options
  const {
    chainName = '',
    target = '',
    connection,
    accessibility,
  } = options

  const result = await connection.db
    .collection(`common_${accessibility}_storages`)

  numberOfItems = this.itemNumberLimiter(numberOfItems)

  const data = await result
    .find({
      chainName: chainName.toLowerCase(),
      target: target.toLowerCase(),
    })
    .limit(numberOfItems)
    .sort({timeStamp: -1})
    .toArray()

  return data.reverse()
}

module.exports.resultReducer = async (options = {}) => {
  let {numberOfItems} = options
  const {lines} = options
  if (!numberOfItems || numberOfItems > 10000) {
    numberOfItems = 10000
  }

  let reducedLines = []

  if (lines.length <= numberOfItems) {
    reducedLines = lines
  }
  else {
    const nthLine = parseInt(lines.length / numberOfItems, 10) + 1
    reducedLines = lines.filter((value, index) => (index % nthLine) === 0)
  }

  return reducedLines
}

module.exports.timespanRequest = async (options = {}) => {
  const {
    connection,
    accessibility,
    chainName = '',
    target = '',
    startTime,
    endTime,
  } = options

  const result = await connection.db
    .collection(`common_${accessibility}_storages`)
  return await result
    .find({
      chainName: chainName.toLowerCase(),
      target: target.toLowerCase(),
      timeStamp: {
        $gte: isodate(startTime),
        $lt: isodate(endTime),
      },
    })
    .toArray()
}

/* eslint-disable no-unused-vars */
module.exports.aggregator = async (options = {}) => {
  const {
    chainName = '',
    target = '',
    accessibility,
    connection,
    startTime,
    endTime,
    numberOfItems,
  } = options

  let lines = []

  if (startTime && endTime) {
    lines = await this.resultReducer({
      lines: await this.timespanRequest(options),
      numberOfItems,
    })
  }
  else {
    lines = await this.entriesRequest(options)
  }

  return lines.map(line => Object.assign(line, {chainName}))
}
