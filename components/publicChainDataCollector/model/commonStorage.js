const Schema = require('mongoose').Schema

module.exports = new Schema({
  chainName: {type: String},
  timeStamp: {type: Date},
  numberOfWorkers: {type: Number},
  numberOfMiners: {type: Number},
  avgHashrate: {type: Number},
  avgBlocktime: {type: Number},
  timeToNextEpoch: {type: Number},
})
