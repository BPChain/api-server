/*
  Defines and starts api server
*/

const config = require('../config')
const logger = require('../logger/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')


async function start ({activeChainName}) {
  const connection = await mongoConnector
    .connect('mongodb://mongodb/chainboarddb?authSource=admin')
  const log = logger({connection})
  log.info('Starting API-Server...')
  createServer({
    activeChainName,
    connection,
    config,
    log,
  })
}

start({activeChainName: 'ethereum'})
