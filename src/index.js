const config = require('../config')
const logger = require('../logger/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')

const connection = mongoConnector
  .connect('mongodb://mongodb/chainboarddb?authSource=admin')
const log = logger({connection})

async function start (options = {}) {
  const {activeChainName} = options
  return await createServer({
    activeChainName,
    connection,
    config,
    log,
  })
}

log.info('Starting API-Server...')
start({activeChainName: 'Ethereum'})

module.exports = start
