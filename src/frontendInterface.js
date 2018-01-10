const path = require('path')

const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')

const config = require('./config')

module.exports = (options = {}) => {

  const {
    connection,
  } = options

  const privateAggregator = require('../components/privateChains/aggregator')
  const publicAggregator = require('../components/publicChains/aggregator')
  const createHandleGetStatistics = require('../routes/handleGetStatistics')


  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})
  const log = console


  const handleGetStatistics = createHandleGetStatistics({
    cache,
    connection,
    log,
    privateAggregator,
    publicAggregator,
  })

  const app = express()

  app.use(cors())
  app.get('/api/:accessibility/:chainName', handleGetStatistics)

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'))
  })

  return app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })


}
