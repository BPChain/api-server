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

  mongoDB
    .then(async () => {
      log.info('Mongodb has been connected')
    })
    .catch(async (error) => {
      log.error('Error while trying to connect with mongodb')
      throw error
    })

  return mongoDB
}
