const md5 = require('js-md5')
const ws = require('ws')

const bufferAggregator = require('./bufferAggregator')
const config = require('../../src/config')

const log = console


function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

function checkJsonContent (json) {
  const expectedKeys = [
    'hostId',
    'isMining',
    'hashrate',
    'avgBlocktime',
    'gasPrice',
    'avgDifficulty',
  ]

  const hasAllKeys = expectedKeys.every((item) => {
    const keyExists = json.hasOwnProperty(item)
    if (!keyExists) {
      log.error('!!! Missing key in backend:', item)
    }
    return keyExists
  })

  if (!hasAllKeys) {
    return false
  }

  return (json.isMining === 1 || json.isMining === 0) &&
    isNumeric(json.hashrate) &&
    isNumeric(json.avgBlocktime) &&
    isNumeric(json.gasPrice) &&
    isNumeric(json.avgDifficulty)
}

module.exports = async (options = {}) => {
  const {chainName, schema, connection} = options


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
      log.info('~ Change Buffer to Buffer B')
      bufferAggregator({
        chainName,
        filledBuffer: '_buffer_a',
        Schema,
        StorageSchema,
        connection,
      })
    }
    else {
      CurrentBuffer = BufferA
      log.info('~ Change buffer to buffer b')
      bufferAggregator({
        chainName,
        filledBuffer: '_buffer_b',
        Schema,
        StorageSchema,
        connection,
      })
    }
    isBufferA = !isBufferA
  }, 15000)


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
          log.error('!!! Received an invalid JSON')
          socket.send(415)
          return
        }
        if (checkJsonContent(privateData)) {
          const dataset = new CurrentBuffer(privateData)
          dataset.save((error, savedModel) => {
            if (error) {
              throw error
            }
            else {
              log.info(
                '+ Stored private from (Hashed host ID): ',
                md5(savedModel.hostId))
              socket.send(200)
            }
          })
        }
        else {
          log.error('!!! Received a JSON with wrong content')
        }
      }
      catch (error) {
        log.error(error)
        socket.send(415)
      }
    })
  })
}
