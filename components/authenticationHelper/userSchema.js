const Schema = require('mongoose').Schema

module.exports = new Schema({
  timestamp: {type: Number},
  username: {type: String},
  pasword: {type: String},
  salt: {type: String},
})
