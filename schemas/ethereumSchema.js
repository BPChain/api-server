const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {
  return new Schema({
    hostId: {type: String},
    hashrate: {type: Number},
    avgBlocktime: {type: Number, default: 20},
    gasPrice: {type: Number},
    avgDifficulty: {type: Number, default: 20},
  })
}
