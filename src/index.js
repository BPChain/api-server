/*
  Defines and starts api server
*/

const config = require('../config')
const logger = require('../logger/createLogger')
const createServer = require('./createServer')
const mongoConnector = require('./mongoConnector')

const connection = mongoConnector
  .connect('mongodb://mongodb/chainboarddb?authSource=admin')
const log = logger({ connection })

const createUser = require('../components/authenticationHelper/createUser')

const superAdmin = {
  username: 'superAdmin',
  password: 'secret',
}

log.info('Creating admin user')
createUser({ connection, log, username: superAdmin.username, password: superAdmin.password })

async function start (options = {}) {
  const { activeChainName } = options
  createServer({
    activeChainName,
    connection,
    config,
    log,
  })
}

log.info('Starting API-Server...')
start({ activeChainName: 'ethereum' })

module.exports = start
