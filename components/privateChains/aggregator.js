const mongoose = require('mongoose')
const log = console


module.exports = async (options = {}) => {
  const {chainName} = options

  let dataLine = {
    id: 0,
    chain: chainName,
    timeStamp: 0,
    numberOfHosts: 0,
    numberOfMiners: 0,
    avgHashrate: 0,
    avgBlocktime: 0,
    avgGasPrice: 0,
    avgDifficulty: 0,
  }

  const result = await mongoose.connection.db
    .collection(`${chainName}_storages`)

  const data = await result
    .find({})
    .toArray()

  const line = data[data.length - 1]
  dataLine = Object.assign(dataLine, line)

  return dataLine
}

