const express = require('express')
const app = express()
const server = require('http')
  .createServer(app)
const io = require('socket.io')(server)


let activeClient = null

module.exports = {
  startServer: async (options = {}) => {
    const {log = console, port = 4040} = options

    server.listen(port, () => {
      log.info(`Backend Server waiting for connections on port ${port}`)
    })

    io.on('connection', client => {
      log.info('Client connected')
      activeClient = client
    })
  },
  sendMessage: (options = {}) => {
    const {log, message} = options
    try {
      if (activeClient) {
        log.debug('Found active client')
        activeClient.emit(
          'messages',
          JSON.stringify(message),
        )
        log.info('Message sent')
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
