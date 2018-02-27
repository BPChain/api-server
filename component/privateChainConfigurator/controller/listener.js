const ws = require('ws')

const WebSocketServer = ws.Server
let activeClient = null

module.exports = {
  startServer: async (options = {}) => {
    const {log = console, port = 4040} = options
    const wsServer = new WebSocketServer({port})
    log.info(`Backend Server waiting for connections on port ${port}`)
    wsServer.on('connection', client => {
      log.info('Client connected')
      activeClient = client
    })
    return wsServer
  },
  sendMessage: (options = {}) => {
    const {log = console, message = {}} = options
    try {
      if (activeClient) {
        log.info('Found active client')
        activeClient.send(JSON.stringify(message))
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
