/*
  Defines and starts api server
*/

const config = require('../config')
const logger = require('../logger/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')

const consoleLogger = console

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

process.on('uncaughtException', (error) => {
  consoleLogger.error('Caught exception:')
  consoleLogger.error(error)
  consoleLogger.error(error.stack)
})

start()
