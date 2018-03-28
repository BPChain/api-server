const Schema = require('mongoose').Schema

module.exports = new Schema({
  hostId: {type: String},
  chainName: {type: String},
  target: {type: String},
  isMining: {type: Number},
  hashrate: {type: Number},
  avgBlocktime: {type: Number},
  gasPrice: {type: Number},
  avgDifficulty: {type: Number},
})
