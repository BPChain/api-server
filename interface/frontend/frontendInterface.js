/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')

const config = require('../../config')

module.exports = (options = {}) => {

  const {
    backendController,
    activeChain,
    connection,
    log,
  } = options

  const aggregator = require('../../components/dbRequests/aggregator')
  const handleGetStatisticsFactory = require('../../routes/handleGetStatistics')
  const displayLogsFactory = require('../../routes/displayLogs')
  const changeParameter = require('../../routes/changeParameters')({
    backendController,
    activeChain,
    log,
  })


  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})

  const handleGetStatistics = handleGetStatisticsFactory({
    cache,
    connection,
    log,
    aggregator,
  })

  const displayLogs = displayLogsFactory({connection})

  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.get('/api/:accessibility/:chainName', handleGetStatistics)

  app.get('/log', displayLogs)

  app.post('/change', changeParameter)

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'))
  })

  return app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}