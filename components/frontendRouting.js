/*
  Defines web interface for frontend
*/

const path = require('path')

const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const csp = require('helmet-csp')
const express = require('express')
const expressFileUpload = require('express-fileupload')
const NodeCache = require('node-cache')
const session = require('express-session')
// const morgan = require('morgan')

const config = require('../config')

const uploadFactory = require('./scyllaLogParser/controller/uploadFactory')

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

  const privateChainConfigurator = require(
    './/privateChainConfigurator/controller/privateConfigurator'
  )
  const setChainInfoFactory = privateChainConfigurator.setChainInfoFactory
  const getChainInfoFactory = privateChainConfigurator.getChainInfoFactory

  const userHandler = require('./authenticationHandler/userHandler')
  const loginState = require('./authenticationHandler/loginLogoutHandler')

  const superAdmin = {
    username: process.env.FRONTEND_ADMIN,
    password: process.env.FRONTEND_ADMIN_PASSWORD,
  }

  log.info('Creating admin user')
  userHandler
    .createUser({connection, log, username: superAdmin.username, password: superAdmin.password})

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
    connection,
  })

  const createUser = userHandler.createUserRoute({
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

  const logIn = loginState.loginRouteFactory({
    connection,
    sessionCache,
    log,
  })

  const upload = uploadFactory.upload({connection, log})
  const getScenarios = uploadFactory.getScenarios({connection})
  const defineScenario = uploadFactory.defineScenario({connection, log})

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
  app.use(cors({
    origin: [
      'http://localhost:4200',
      'https://bpt-lab.org/bp2017w1-frontend',
    ], credentials: true,
  }))
  app.use(helmet())
  app.use(helmet.referrerPolicy({policy: 'strict-origin'}))
  app.use(csp({
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\''],
      fontSrc: ['\'self\'', 'fonts.googleapis.com'],
    },
  }))

  // app.use(morgan('combined'))

  app.post('/scenarios/upload/', loginState.authenticate, upload)

  app.get('/scenarios', loginState.authenticate, getScenarios)

  app.post('/scenarios', loginState.authenticate, defineScenario)

  app.get('/chain/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.get('/chain', getChainInfo)

  app.get('/log', displayLogs)

  app.post('/user/login', logIn)

  app.get('/user/check', loginState.authenticate, (request, response) => {
    response.sendStatus(200)
  })

  app.post('/user/logout', loginState.authenticate, loginState.logout)

  app.post('/chain', loginState.authenticate, setParameters)

  app.post('/user/create', loginState.authenticate, createUser)

  app.post('/recordings/start', loginState.authenticate, activeChains.startRecording())

  app.post('/recordings/stop', loginState.authenticate, activeChains.stopRecording())

  app.post('/recordings/cancel', loginState.authenticate, activeChains.cancelRecording())

  app.get('/recordings', loginState.authenticate, activeChains.getListOfRecordings())

  app.get('/recordings/isRecording', loginState.authenticate, activeChains.isRecordingActive())

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dataStorageAccessor/view/index.html'))
  })

  return app.listen(config.ports.frontend, () => {
    log.info(`Frontend interface running on port ${config.ports.frontend}`)
  })
}
