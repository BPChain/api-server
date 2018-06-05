/*
  Defines and starts api server
*/

const config = require('../config')
const logger = require('../components/loggerHandler/model/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')


async function start () {
  const connection = await mongoConnector
    .connect('mongodb://mongodb/chainboarddb?authSource=admin')
  const log = logger({connection})
  log.info('Starting API-Server...')
  createServer({
    connection,
    config,
    log,
  })
}

start()
