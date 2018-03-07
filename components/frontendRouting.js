/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')
const session = require('express-session')
const passport = require('passport')

const config = require('../config')

const createUser = require('./authenticationHelper/createUser')
const authMiddleware = require('./authenticationHelper/authenticationMiddleware')
const validateUser = require('./authenticationHelper/validateUser')

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

  // Init passport authentication
  // app.use(passport.initialize())
  // persistent login sessions
  // app.use(passport.session())

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  app.use(cors())

  app.get('/api/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.get('/log', displayLogs)

  app.post('/login', async (request, response) => {
    if (await validateUser({
      username: request.body.username,
      password: request.body.password,
      connection,
    })) {
      sessionCache.set(request.sessionID, true, (error, success) => {
        if (!error && success) {
          log.info(`Authenticated new session: ${request.sessionID}`)
        }
        else {
          log.error(
            `Error occured trying to cache session: ${request.sessionID}`
          )
        }
      })
      response.sendStatus('200')
    }
    else {
      response.sendStatus('401')
    }
  })

  app.post('/api/change', authMiddleware(), async (request, response) => {
    const status = await changeParameter(request, response)
    response.sendStatus(status)
  })

  app.post('/api/createUser', authMiddleware(), async (request, response) => {
    const success = await createUser({
      connection,
      log,
      username: request.body.username,
      password: request.body.password,
    })
    if (success) {
      response.sendStatus(200)
    }
    else {
      response.sendStatus(500)
    }
  })

  app.get('/*', (request, response) => {
    response.sendFile(
      path.join(__dirname, 'dataStorageAccessor/view/index.html')
    )
  })

  return app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}
