const config = require('../src/config')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')

const log = console


async function start () {
  return await createServer({
    connection: mongoConnector
      .connect('mongodb://mongodb/chainboarddb?authSource=admin'),
    config,
    log,
  })
}

start()

module.exports = start
