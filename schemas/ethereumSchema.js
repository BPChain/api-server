const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {
  return new Schema({
    hostId: {type: String},
    isMining: {type: Number},
    hashrate: {type: Number},
    avgBlocktime: {type: Number},
    gasPrice: {type: Number},
    avgDifficulty: {type: Number},
  })
}
