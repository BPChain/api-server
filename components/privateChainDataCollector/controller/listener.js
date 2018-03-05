const ws = require('ws')


const config = require('../../../config')
const bufferAggregator = require('../model/bufferAggregator')
const isValidJson = require('../model/checkJsonContent')
const DoubleBuffer = require('../model/doubleBuffer')

/*
  Creates a websocket listening for private chain data and two buffers
  that alternatively store the data and get aggregated into the database
*/

module.exports = async (options = {}) => {
  const {
    activeChain,
    schema,
    connection,
    log,
  } = options


  const StorageSchema = require(
    `../model/${activeChain.get()
      .toLowerCase()}Storage`
  )
  const Schema = require(`../model/${schema}`)

  const doubleBuffer = new DoubleBuffer({
    activeChain,
    connection,
    log,
    Schema,
    StorageSchema,
  })

  setInterval(() => {
    doubleBuffer.toggleActiveBuffer()
    doubleBuffer.aggregateBuffer(bufferAggregator)
  }, config.bufferSwitchTime)


  const WebSocketServer = ws.Server
  const wsServer = new WebSocketServer({port: config.dataAggregatorPort})
  log.info(`Backend socket running on port ${config.dataAggregatorPort}`)
  wsServer.on('connection', (socket) => {
    socket.on('message', (message) => {
      try {
        let privateData = {}
        try {
          privateData = JSON.parse(message)
        }
        catch (error) {
          log.error(`Received an invalid JSON: ${message}`)
          socket.send(415)
          return
        }
        if (isValidJson({json: privateData, log})) {
          doubleBuffer.storeTempPrivateData(privateData)
          socket.send(200)
        }
        else {
          log.error(`Received a JSON with wrong content: ${privateData}`)
        }
      }
      catch (error) {
        log.error(`Error occured while receiving private data: ${error}`)
        socket.send(415)
      }
    })
  })
}
