const isodate = require('isodate')

const log = console

module.exports = async (options = {}) => {

  const {
    chainName,
    connection,
    numberOfItems,
    startTime,
    endTime,
  } = options

  const result = await connection.db.collection(`${chainName}_public_storages`)

  let data
  let lines

  if (startTime && endTime) {
    log.info(`? Access items from ${startTime} to ${endTime} without cache`)

    lines = await result
      .find({
        timeStamp: {
          $gte: isodate(startTime),
          $lt: isodate(endTime),
        },
      })
      .toArray()
  }
  else if (numberOfItems) {
    log.info(`? Access last ${numberOfItems} items without cache`)

    data = await result
      .find({})
      .toArray()

    lines = data.slice(Math.max(data.length - numberOfItems, 1))
  }
  else {
    data = await result
      .find({})
      .toArray()

    lines = data.slice(1)
  }


  const dataLine = lines.map((line) => {
    return Object.assign(line, {chain: chainName})
  })

  return dataLine
}
