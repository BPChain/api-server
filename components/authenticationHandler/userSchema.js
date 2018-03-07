const Schema = require('mongoose').Schema

module.exports = new Schema({
  timestamp: {type: Number},
  username: {type: String},
  password: {type: String},
  salt: {type: String},
}, { _id: false, autoIndex: false })
