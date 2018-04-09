const ws = require('ws')

const bufferAggregator = require('../model/bufferAggregator')
const isValidJson = require('../model/checkJsonContent')
const DoubleBuffer = require('../model/doubleBuffer')

/*
  Creates a websocket listening for private chain data and two buffers
  that alternatively store the data and get aggregated into the database
*/

module.exports = async ({activeChains, log, config, connection}) => {
  const StorageSchema = require('../model/ethereumStorage')
  const Schema = require('../model/ethereumSchema')

  const doubleBuffer = new DoubleBuffer({
    activeChains,
    bufferAggregator,
    log,
    config,
    connection,
    Schema,
    StorageSchema,
  })

  const WebSocketServer = ws.Server
  const wsServer = new WebSocketServer({port: config.dataAggregatorPort})
  log.info(`Backend socket running on port ${config.dataAggregatorPort}`)
  wsServer.on('connection', (socket) => {
    socket.on('message', (message) => {
      try {
        if (isValidJson({json: message, log})) {
          doubleBuffer.storeTempPrivateData(JSON.parse(message))
          socket.send(200)
        }
        else {
          throw new Error(`JSON has wrong content: ${message}`)
        }
      }
      catch (error) {
        log.error(`While receiving private data: ${error}`)
        socket.send(415)
      }
    })
  })
  return {
    wsServer,
    doubleBuffer,
  }
}
