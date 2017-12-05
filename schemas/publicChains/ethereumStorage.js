const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {
  return new Schema({
    chain: {type: String},
    timeStamp: {type: Number},
    numberOfWorkers: {type: Number},
    numberOfMiners: {type: Number},
    avgHashrate: {type: Number},
    avgBlocktime: {type: Number},
    blockTimeDifficulty: {type: Number},
    timeToNextEpoch: {type: Number},
  })
}
