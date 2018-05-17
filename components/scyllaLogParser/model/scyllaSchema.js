const Schema = require('mongoose').Schema

module.exports = new Schema({
  logContent: {type: Object},
  logName: {type: String},
  timestamp: {type: Date},
  description: {type: String},
})
