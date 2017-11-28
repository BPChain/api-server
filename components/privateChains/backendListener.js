const mongoose = require('mongoose')
const ws = require('ws')

const mongoConnector = require('../../src/mongoConnector')

const log = console


module.exports = async (options) => {
  const {chainName, schema} = options

  const Schema = require(`../../schemas/${schema}`)()
  const BufferA = mongoose.model(`${chainName}_buffer_a`, Schema)
  const BufferB = mongoose.model(`${chainName}_buffer_b`, Schema)

  let CurrentBuffer = BufferA

  let isBufferA = true
  setInterval(() => {
    if (isBufferA) {
      CurrentBuffer = BufferB
      log.info('Change Buffer to Buffer B')
    }
    else {
      CurrentBuffer = BufferA
      log.info('Change Buffer to Buffer A')      
    }
    isBufferA = !isBufferA
  }, 15000) 

  mongoConnector.connect('mongodb://localhost/privateChains')

  const WebSocketServer = ws.Server
  const wsServer = new WebSocketServer({port: 3030})
  log.info('Backend socket running on port 3030')
  wsServer.on('connection', (socket) => {
    socket.on('message', (message) => {
      log.info('received: %s', message)
      try {
        const privateData = JSON.parse(message)
        const dataset = new CurrentBuffer(privateData)
        dataset.save((error, savedModel) => {
          if (error) {
            throw error
          }
          else {
            log.info('Successfully stored input with id: ' + savedModel.id)
            socket.send(200)
          }
        })
      } 
      catch (error) {
        log.info(error)
        socket.send(415)
      } 
    })
  })
}
