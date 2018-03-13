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
  createServer({
    activeChainName,
    connection,
    config,
    log,
  })
}

log.info('Starting API-Server...')
start({activeChainName: 'ethereum'})
