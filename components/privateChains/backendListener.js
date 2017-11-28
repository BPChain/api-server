const mongoose = require('mongoose')
const ws = require('ws')

const mongoConnector = require('../../src/mongoConnector')

const log = console


module.exports = async (options) => {
  const {chainName, schema} = options

  const Schema = require(`../../schemas/${schema}`)()
  const BufferA = mongoose.model(`${chainName}-buffer-a`, Schema)
  const BufferB = mongoose.model(`${chainName}-buffer-b`, Schema)

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

  // const currentBuffer = BufferA


  mongoConnector.connect('mongodb://localhost/privateChains')

  const WebSocketServer = ws.Server
  const wsServer = new WebSocketServer({port: 3030})
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
            log.info('Successfully saved:', savedModel)
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