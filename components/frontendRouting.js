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

const config = require('../config')

const uploadFactory = require('./scyllaLogParser/controller/uploadFactory')
const DataCollector = require('./privateChainDataCollector/controller/DataCollector')

module.exports = ({
  backendController,
  activeChains,
  connection,
  log,
}) => {

  const dataRequests = require(
    '../components/dataStorageAccessor/model/dataRequests',
  )
  const aggregator = dataRequests.aggregator

  const handleGetStatisticsFactory =
    require('./dataStorageAccessor/controller/handleGetStatisticsFactory')
  const displayLogsFactory =
    require('./loggerHandler/controller/displayLogsFactory')

  const dataCollector = new DataCollector({
    activeChains,
    log,
    config,
    connection,
  })

  const privateChainConfigurator = require(
    './privateChainConfigurator/controller/privateConfigurator'
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

  app.use(loginState.userSession)

  const sessionCache = loginState.sessionCache

  const logIn = loginState.loginRouteFactory({connection, sessionCache, log})

  const upload = uploadFactory.upload({connection, log})
  const getScenarios = uploadFactory.getScenarios({connection})
  const defineScenario = uploadFactory.defineScenario({connection, log})

  app.use(loginState.checkUserSession(sessionCache))
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

  app.post('/scenarios/upload/', loginState.authenticate, upload)

  app.get('/scenarios', loginState.authenticate, getScenarios)

  app.post('/scenarios', loginState.authenticate, defineScenario)

  app.get('/chain/:accessibility(private|public)/:chainName', handleGetStatistics)

  app.post('/chain/private/:chainName', dataCollector.storeMessage())

  app.get('/chain', getChainInfo)

  app.get('/log', displayLogs)

  app.post('/user/login', logIn)

  app.get('/user/check', loginState.authenticate, (request, response) => response.send('OK'))

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

  const server = app.listen(config.ports.frontend, () => {
    log.info(`Frontend interface running on port ${config.ports.frontend}`)
  })
  return () => {
    dataCollector.stopBuffer()
    server.close()
  }
}
