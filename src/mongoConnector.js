/*
  Establish and return database connection
*/

const mongoose = require('mongoose')

const log = console

module.exports.connect = mongoUri => {
  mongoose.Promise = global.Promise
  const mongoDB = mongoose.connect(mongoUri, {
    useMongoClient: true,
    promiseLibrary: global.Promise,
    user: process.env.MONGO_ADD_CHAINBOARDDBUSER_USERNAME,
    pass: process.env.MONGO_ADD_CHAINBOARDDBUSER_PASSWORD,
  })
  return mongoDB
    .then(connection => {
      log.info('Mongodb has been connected')
      return connection
    })
    .catch(error => {
      log.error(`Error while trying to connect with mongodb ${error}`)
      throw error
    })
}
