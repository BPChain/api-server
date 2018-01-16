const Schema = require('mongoose').Schema

module.exports = () => {
  return new Schema({
    log: Schema.Types.Mixed,
    timeStamp: {type: Date},
  })
}
