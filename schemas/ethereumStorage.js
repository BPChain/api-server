const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {
  return new Schema({
    chain: {type: String},
    timeStamp: {type: Number},
    numberOfHosts: {type: Number},
    avgHashrate: {type: Number},
    avgBlocktime: {type: Number},
    avgGasPrice: {type: Number},
    avgDifficulty: {type: Number},
  })
}
