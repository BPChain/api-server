const Schema = require('mongoose').Schema

module.exports = new Schema({
  logContent: {type: String},
  logName: {type: String},
  timestamp: {type: Date},
})
