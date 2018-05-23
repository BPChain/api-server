const Schema = require('mongoose').Schema

module.exports = new Schema({
  hostId: {type: String},
  chainName: {type: String},
  target: {type: String},
  isMining: {type: Number},
  hashrate: {type: Number},
  avgBlocktime: {type: Number},
  blockSize: {type: Number},
  avgDifficulty: {type: Number},
  avgTransactions: {type: Number},
  cpuUsage: {type: Number},
})
