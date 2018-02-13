const ws = require('ws')
const WebSocketServer = ws.Server


class FrontendInterface {
  constructor (options = {}) {
    const {port = 40404, log = console, blockchainController} = options
    this.port = port
    this.log = log
    this.blockchainController = blockchainController
  }

  start () {
    const wsServer = new WebSocketServer({port: this.port})
    this.log.info(`Intern Server waiting for connections on port ${this.port}`)
    wsServer.on('connection', client => {
      this.log.info(`Frontend connected on port ${this.port}`)
      client.on('message', data => {
        this.log.info(`Redirecting message ${data}`)
        const result = this.blockchainController.sendMessage(JSON.parse(data))
        if (result) {
          client.send(200)
        }
        else {
          client.send(405)
        }
      })
    })
  }
}

module.exports = FrontendInterface
