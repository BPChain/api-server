const Schema = require('mongoose').Schema

module.exports = Schema({
  hostId: {type: String},
  isMining: {type: Number},
  hashrate: {type: Number},
  avgBlocktime: {type: Number},
  gasPrice: {type: Number},
  avgDifficulty: {type: Number},
})
