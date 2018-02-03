const config = require('../config')
const logger = require('../logger/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')

const connection = mongoConnector
  .connect('mongodb://mongodb/chainboarddb?authSource=admin')
const log = logger({connection})

async function start () {
  return await createServer({
    connection,
    config,
    log,
  })
}

log.info('Starting API-Server...')
start()

module.exports = start
