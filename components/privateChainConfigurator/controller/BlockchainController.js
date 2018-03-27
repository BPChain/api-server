const ws = require('ws')
const WebSocketServer = ws.Server


class BlockchainController {
  constructor (options = {}) {
    const {log = console, port = 4040, clientArray = []} = options
    this.log = log
    this.port = port
    this.clientArray = clientArray
  }

  getClientArray () {
    return this.clientArray
  }

  getClientInfos () {
    return this.clientArray
      .map(client => {
        return client.chains.map(chain => Object.assign({target: client.target}, chain))
      })
      .reduce((result, item) => result.concat(item), [])
  }

  start () {
    const wsServer = new WebSocketServer({port: this.port})
    this.log.info(`Backend Server waiting for connections on port ${this.port}`)
    wsServer.on('connection', connection => {
      this.log.info(`Client connected on port ${this.port}`)
      connection.on('message', data => {
        const client = JSON.parse(data).target
        this.log.info(`Client authentificated as: ${client}`)
        this.clientArray.push({target: client, connection})
      })
      connection.on('close', () => {
        this.log.info('Closing connection')
        this.clientArray = this.clientArray.filter(
          client => client.connection !== connection
        )
        this.log.info(`Open connections: ${this.clientArray}`)
      })
    })
    return wsServer
  }

  sendMessage ({message, target}) {
    const targetClient = this.clientArray
      .filter(Boolean)
      .find(client => client.target === target)
    if (targetClient) {
      this.log.info(`Send ${message} to ${target}`)
      targetClient.connection.send(JSON.stringify(message))
      return true
    }
    return false
  }
}


module.exports = BlockchainController
