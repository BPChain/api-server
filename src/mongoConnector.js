const mongoose = require('mongoose')

const log = console

module.exports.connect = mongoUri => {

  mongoose.Promise = global.Promise
  const mongoDB = mongoose.connect(mongoUri, {
    useMongoClient: true,
    promiseLibrary: global.Promise,
  })

  mongoDB
    .then(() => {
      log.info('Mongodb has been connected')
    })
    .catch(error => {
      log.info('Error while trying to connect with mongodb')
      throw error
    })

  return mongoDB
}