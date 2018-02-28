const ws = require('ws')

const bufferAggregator = require('../model/bufferAggregator')
const isValidJson = require('../model/checkJsonContent')
const config = require('../../../config')
const helper = require('./listenerHelper')


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

  const BufferA = helper.createBuffer(connection, activeChain, Schema, 'A')
  const BufferB = helper.createBuffer(connection, activeChain, Schema, 'B')

  helper.setCurrentBuffer(BufferA)
  helper.setBufferAActive(true)

  setInterval(() => {
    if (helper.isBufferAActive()) {
      helper.setCurrentBuffer(BufferB)
      log.trace('Change Buffer to Buffer B')
      helper.aggregateBuffer('A', bufferAggregator,
        activeChain, Schema, StorageSchema, connection, log)
    }
    else {
      helper.setCurrentBuffer(BufferA)
      log.trace('Change buffer to Buffer A')
      helper.aggregateBuffer('B', bufferAggregator,
        activeChain, Schema, StorageSchema, connection, log)
    }
    helper.setBufferAActive(!helper.isBufferAActive())
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
          log.error(`Received an invalid JSON:
            ${message}`)
          socket.send(415)
          return
        }
        if (isValidJson({json: privateData, log})) {
          const BufferToStore = helper.getCurrentBuffer()
          const dataset = new BufferToStore(privateData)
          dataset.save((error, savedModel) => {
            if (error) {
              throw error
            }
            else {
              log.debug(`Stored private data:
                ${savedModel}`)
              socket.send(200)
            }
          })
        }
        else {
          log.error(`Received a JSON with wrong content:
            ${privateData}`)
        }
      }
      catch (error) {
        log.error(`Error occured while receiving private data:
          ${error}`)
        socket.send(415)
      }
    })
  })
}
