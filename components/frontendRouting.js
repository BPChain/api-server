/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')
const session = require('express-session')

const config = require('../config')

const authMiddleware = require('./authenticationHandler/authenticationMiddleware')

module.exports = ({
  backendController,
  activeChain,
  connection,
  log,
}) => {

  const aggregator = require('./dataStorageAccessor/model/aggregator')

  const handleGetStatisticsFactory =
    require('./dataStorageAccessor/controller/handleGetStatisticsFactory')
  const displayLogsFactory =
    require('./loggerHandler/controller/displayLogsFactory')
  const changeParametersFactory =
    require('./privateChainConfigurator/controller/changeParametersFactory')
  const loginRouteFactory =
    require('./authenticationHandler/loginRouteFactory')
  const userCreationRouteFactory =
    require('./authenticationHandler/userCreationRouteFactory')

  const handleGetStatistics = handleGetStatisticsFactory({
    connection,
    log,
    aggregator,
  })
  const displayLogs = displayLogsFactory({
    connection,
  })
  const changeParameter = changeParametersFactory({
    backendController,
    activeChain,
    log,
  })

  const createUser = userCreationRouteFactory({
    connection,
    log,
  })

  const app = express()

  app.use(session({
    secret: 'workworkworkworkwork', // change!
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 300000 },
  }))
  const sessionCache = new NodeCache({
    stdTTL: 1800,
    checkperiod: 900,
    errorOnMissing: true,
  })

  const logIn = loginRouteFactory({connection,
    sessionCache,
    log,
  })

  app.use((request, response, next) => {
    sessionCache.get(request.sessionID, (error, value) => {
      if (!error) {
        if (value !== undefined) {
          request.isAuthenticated = true
          next()
        }
        else {
          request.isAuthenticated = false
          next()
        }
      }
      else {
        request.isAuthenticated = false
        next()
      }
    })
  })

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  app.use(cors())

  app.get('/api/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.get('/log', displayLogs)

  app.post('/login', logIn)

  app.post('/api/change', authMiddleware, async (request, response) => {
    const status = await changeParameter(request, response)
    response.sendStatus(status)
  })

  app.post('/api/createUser', authMiddleware, createUser)

  app.get('/*', (request, response) => {
    response.sendFile(
      path.join(__dirname, 'dataStorageAccessor/view/index.html')
    )
  })

  return app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}
