const execa = require('execa')
const mongoose = require('mongoose')
const path = require('path')

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
      await execa(path.join(__dirname, 'unsetEnvVariables.sh'))
    })
    .catch(async (error) => {
      log.error('Error while trying to connect with mongodb')
      await execa(path.join(__dirname, 'unsetEnvVariables.sh'))
      throw error
    })

  return mongoDB
}
