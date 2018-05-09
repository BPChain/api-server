/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressFileUpload = require('express-fileupload')
const NodeCache = require('node-cache')
const session = require('express-session')
const morgan = require('morgan')

const config = require('../config')

const uploadFactory = require('./scyllaLogParser/component/uploadFactory')

const authMiddleware = require('./authenticationHandler/authenticationMiddleware')
const logOut = require('./authenticationHandler/logout')

module.exports = ({
  backendController,
  activeChains,
  connection,
  log,
}) => {

  const aggregator = require('./dataStorageAccessor/model/aggregator')

  const handleGetStatisticsFactory =
    require('./dataStorageAccessor/controller/handleGetStatisticsFactory')
  const displayLogsFactory =
    require('./loggerHandler/controller/displayLogsFactory')
  const setChainInfoFactory =
    require('./privateChainConfigurator/controller/setChainInfoFactory')
  const loginRouteFactory =
    require('./authenticationHandler/loginRouteFactory')
  const userCreationRouteFactory =
    require('./authenticationHandler/userCreationRouteFactory')
  const getChainInfoFactory =
    require('./privateChainConfigurator/controller/getChainInfoFactory')

  const createUser = require('./authenticationHandler/createUser')

  const superAdmin = {
    username: process.env.FRONTEND_ADMIN,
    password: process.env.FRONTEND_ADMIN_PASSWORD,
  }

  log.info('Creating admin user')
  createUser({connection, log, username: superAdmin.username, password: superAdmin.password})

  const handleGetStatistics = handleGetStatisticsFactory({
    connection,
    log,
    aggregator,
  })
  const displayLogs = displayLogsFactory({
    connection,
  })
  const setParameters = setChainInfoFactory({
    activeChains,
    backendController,
    log,
  })

  const createUserRoute = userCreationRouteFactory({
    connection,
    log,
  })

  const getChainInfo = getChainInfoFactory({backendController, activeChains})

  const app = express()

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dummySecret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 900000},
    sameSite: true,
  }))

  const sessionCache = new NodeCache({
    stdTTL: 1800,
    checkperiod: 900,
    errorOnMissing: false,
  })

  const logIn = loginRouteFactory({
    connection,
    sessionCache,
    log,
  })

  const upload = uploadFactory.upload({connection, log})
  const getScenarios = uploadFactory.getScenarios({connection})

  app.use((request, response, next) => {
    log.info('session cookie', request.sessionID)
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
        log.warn('Session cache error!')
        request.isAuthenticated = false
        next()
      }
    })
  })


  app.use(expressFileUpload())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  app.use(cors({origin: [
    'http://localhost:4200',
    'https://bpt-lab.org/bp2017w1-frontend',
  ], credentials: true}))

  app.use(morgan('combined'))

  app.post('/api/upload/', authMiddleware, upload)

  app.get('/api/getAllScenarios', authMiddleware, getScenarios)

  app.get('/api/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.get('/api/getChainInfo',  getChainInfo)

  app.get('/log', displayLogs)

  app.post('/login', logIn)

  app.get('/checkLogin', authMiddleware, (request, response) => {
    response.sendStatus(200)
  })

  app.post('/logout', authMiddleware, logOut)

  app.post('/api/setParameters', authMiddleware, setParameters)

  app.post('/api/createUser', authMiddleware, createUserRoute)

  app.post('/api/recordings/start', authMiddleware, activeChains.startRecording())

  app.post('/api/recordings/stop', authMiddleware, activeChains.stopRecording())

  app.post('/api/recordings/cancel', authMiddleware, activeChains.cancelRecording())

  app.get('/api/recordings', authMiddleware, activeChains.getListOfRecordings())

  app.get('/api/recordings/isRecording', authMiddleware, activeChains.isRecordingActive())

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dataStorageAccessor/view/index.html'))
  })

  return app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}
