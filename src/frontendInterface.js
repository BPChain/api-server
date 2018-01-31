const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')

const config = require('./config')

module.exports = (options = {}) => {

  const {
    backendController,
    connection,
    log,
  } = options

  const aggregator = require('../components/dbRequests/aggregator')
  const createHandleGetStatistics = require('../routes/handleGetStatistics')
  const createDisplayLogs = require('../routes/displayLogs')
  const changeParameter = require('../routes/changeParameters')({
    backendController,
    log,
  })


  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})

  const handleGetStatistics = createHandleGetStatistics({
    cache,
    connection,
    log,
    aggregator,
  })

  const displayLogs = createDisplayLogs({connection})

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
