const express = require('express')
const app = express()
const server = require('http')
  .createServer(app)
const io = require('socket.io')(server)


let logger = console
let activeClient = null

module.exports = {
  startServer: async (options = {}) => {
    const {log} = options
    let {port} = options

    if (log) {
      logger = log
    }

    if (!port) {
      port = 4040
    }

    server.listen(port, () => {
      logger.info(`Backend Server waiting for connections on port ${port}`)
    })

    io.on('connection', client => {
      logger.info('Client connected')
      activeClient = client
    })
  },
  sendMessage: (options = {}) => {
    let {message} = options

    try {
      message = JSON.stringify(message)
      logger.info(`Send message: ${message}`)

      if (activeClient) {
        activeClient.emit('messages', message)
        return true
      }
      else {
        logger.warn('No client connected')
        return false
      }
    }
    catch (error) {
      logger.error(`Can not send message ${message}`)
      return false
    }
  },
}
