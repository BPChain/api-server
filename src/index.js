const config = require('../src/config')
const logger = require('./createLogger')
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

start()

module.exports = start
