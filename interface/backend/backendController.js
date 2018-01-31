const express = require('express')
const app = express()
const server = require('http')
  .createServer(app)
const io = require('socket.io')(server)


let activeClient = null

module.exports = {
  startServer: async (options = {}) => {
    const {log = console} = options
    let {port} = options


    if (!port) {
      port = 4040
    }

    server.listen(port, () => {
      log.info(`Backend Server waiting for connections on port ${port}`)
    })

    io.on('connection', client => {
      log.info('Client connected')
      activeClient = client
    })
  },
  sendMessage: (options = {}) => {
    const {log} = options
    let {message} = options

    try {
      message = JSON.stringify(message)
      log.info(`Send message: ${message}`)

      if (activeClient) {
        activeClient.emit('messages', message)
        return true
      }
      else {
        log.warn('No client connected')
        return false
      }
    }
    catch (error) {
      log.error(`Can not send message ${message}`)
      return false
    }
  },
}
