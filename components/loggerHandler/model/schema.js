const Schema = require('mongoose').Schema

module.exports = new Schema({
  log: {type: String},
  logLevel: {type: Number},
  timeStamp: {type: Date},
})
