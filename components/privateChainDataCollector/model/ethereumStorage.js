const Schema = require('mongoose').Schema

module.exports = new Schema({
  chainName: {type: String},
  timeStamp: {type: Date},
  numberOfHosts: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  avgGasPrice: {type: Number},
  avgDifficulty: {type: Number},
})
