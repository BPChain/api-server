const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = () => {  
  return new Schema({
    id: {type: String},
    hostId: {type: String},
    hashrate: {type: Number},
    avgBlocktime: {type: Number, default: 20},
    uptime: {type: Number},
    gasPrice: {type: Number},
    avgDifficulty: {type: Number, default: 20},
  })
}
