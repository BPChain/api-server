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

const dataRequests = require(
  '../components/dataStorageAccessor/model/dataRequests',
)
const handleGetStatisticsFactory =
  require('./dataStorageAccessor/controller/handleGetStatisticsFactory')
const displayLogsFactory =
  require('./loggerHandler/controller/displayLogsFactory')

const privateChainConfigurator = require(
  './privateChainConfigurator/controller/privateConfigurator'
)

const userHandler = require('./authenticationHandler/userHandler')
const loginState = require('./authenticationHandler/loginLogoutHandler')

module.exports = ({
  backendController,
  activeChains,
  connection,
  log,
}) => {

  log.info('Creating admin user')
  const superAdmin = {
    username: process.env.FRONTEND_ADMIN,
    password: process.env.FRONTEND_ADMIN_PASSWORD,
  }
  userHandler
    .createUser({connection, log, username: superAdmin.username, password: superAdmin.password})

  const dataCollector = new DataCollector({
    activeChains,
    log,
    config,
    connection,
  })

  const getChainInfo = privateChainConfigurator.getChainInfoFactory({
    backendController,
    activeChains,
  })

  const setParameters = privateChainConfigurator.setChainInfoFactory({
    activeChains,
    backendController,
    log,
    connection,
  })

  const handleGetStatistics = handleGetStatisticsFactory({
    connection,
    log,
    aggregator: dataRequests.aggregator,
  })
  const displayLogs = displayLogsFactory({
    connection,
  })

  const createUser = userHandler.createUserRoute({
    connection,
    log,
  })

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

  app.get('/log', displayLogs)

  app.get('/scenarios', loginState.authenticate, getScenarios)
  app.post('/scenarios', loginState.authenticate, defineScenario)
  app.post('/scenarios/upload/', loginState.authenticate, upload)

  app.get('/chain', getChainInfo)
  app.post('/chain', loginState.authenticate, setParameters)
  app.get('/chain/:accessibility(private|public)/:chainName', handleGetStatistics)
  app.post('/chain/private/:chainName', dataCollector.storeMessage())


  app.get('/user/check', loginState.authenticate, (request, response) => response.send('OK'))
  app.post('/user/login', logIn)
  app.post('/user/logout', loginState.authenticate, loginState.logout)
  app.post('/user/create', loginState.authenticate, createUser)

  app.get('/recordings', loginState.authenticate, activeChains.getListOfRecordings())
  app.get('/recordings/isRecording', loginState.authenticate, activeChains.isRecordingActive())
  app.post('/recordings/start', loginState.authenticate, activeChains.startRecording())
  app.post('/recordings/stop', loginState.authenticate, activeChains.stopRecording())
  app.post('/recordings/cancel', loginState.authenticate, activeChains.cancelRecording())

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dataStorageAccessor/view/index.html'))
  })

  const server = app.listen(config.ports.frontend, () => {
    log.info(`Interface is running on port ${config.ports.frontend}`)
  })

  return () => {
    dataCollector.stopBuffer()
    server.close()
  }
}
