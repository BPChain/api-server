/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')

const config = require('../config')

module.exports = (options = {}) => {

  const {
    backendController,
    activeChain,
    connection,
    log,
  } = options

  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})

  const aggregator = require('./dataStorageAccessor/model/aggregator')

  const handleGetStatisticsFactory =
    require('./dataStorageAccessor/controller/handleGetStatisticsFactory')
  const displayLogsFactory =
    require('./loggerHandler/controller/displayLogsFactory')
  const changeParametersFactory =
    require('./privateChainConfigurator/controller/changeParametersFactory')

  const handleGetStatistics = handleGetStatisticsFactory({
    cache,
    connection,
    log,
    aggregator,
  })
  const displayLogs = displayLogsFactory({connection})
  const changeParameter = changeParametersFactory({
    backendController,
    activeChain,
    log,
  })

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())

  app.get('/api/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.get('/log', displayLogs)

  app.post('/change', changeParameter)

  app.get('/*', (request, response) => {
    response.sendFile(
      path.join(__dirname, 'dataStorageAccessor/view/index.html')
    )
  })

  app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })

  return app
}
