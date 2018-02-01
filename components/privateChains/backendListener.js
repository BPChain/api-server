const ws = require('ws')

const bufferAggregator = require('./bufferAggregator')
const checkJsonContent = require('./checkJsonContent')
const config = require('../../src/config')


module.exports = async (options = {}) => {
  const {
    chainName,
    schema,
    connection,
    log,
  } = options


  const StorageSchema = require(
    `../../schemas/privateChains/${chainName}Storage`
  )()
  const Schema = require(`../../schemas/privateChains/${schema}`)()
  const BufferA = connection.model(`${chainName}_private_buffer_a`, Schema)
  const BufferB = connection.model(`${chainName}_private_buffer_b`, Schema)

  let CurrentBuffer = BufferA

  let isBufferA = true
  setInterval(() => {
    if (isBufferA) {
      CurrentBuffer = BufferB
      log.trace('Change Buffer to Buffer B')
      bufferAggregator({
        chainName,
        filledBuffer: '_buffer_a',
        Schema,
        StorageSchema,
        connection,
        log,
      })
    }
    else {
      CurrentBuffer = BufferA
      log.trace('Change buffer to Buffer A')
      bufferAggregator({
        chainName,
        filledBuffer: '_buffer_b',
        Schema,
        StorageSchema,
        connection,
        log,
      })
    }
    isBufferA = !isBufferA
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
        if (checkJsonContent({json: privateData, log})) {
          const dataset = new CurrentBuffer(privateData)
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
