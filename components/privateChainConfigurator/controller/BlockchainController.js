const ws = require('ws')
const WebSocketServer = ws.Server


class BlockchainController {
  constructor (options = {}) {
    const {activeChains, log = console, port = 4040, clientArray = []} = options
    this.activeChains = activeChains
    this.log = log
    this.port = port
    this.clientArray = clientArray
    this.intervalId = null
    this.wsServer = null
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

  heartbeat () {
    this.isAlive = true
  }

  start () {
    this.wsServer = new WebSocketServer({port: this.port})
    this.log.info(`Backend Server waiting for connections on port ${this.port}`)
    this.wsServer.on('connection', connection => {

      connection.isAlive = true
      connection.on('pong', this.heartbeat)

      this.log.info(`Client connected on port ${this.port}`)
      connection.on('message', data => {
        this.log.info(`Client authentificated with: ${data}`)
        const {target, chains, monitor, state} = JSON.parse(data)
        if (target) {
          this.clientArray.push({chains, target, connection})
          this.activeChains.clientInfos = this.getClientInfos()
        }
        if (monitor) {
          this.activeChains.setState({monitor, state})
        }
      })

      connection.on('close', () => {
        this.log.info('Closing connection')
        this.clientArray.forEach(client => {
          if (client.connection !== connection) {
            this.activeChains.removeMonitor({monitor: client.target})
          }
        })
        this.clientArray = this.clientArray.filter(
          client => client.connection !== connection
        )
        this.activeChains.clientInfos = this.getClientInfos()
        this.log.info(`Open connections: ${JSON.stringify(this.getClientInfos())}`)
      })
    })

    this.intervalId = setInterval(() => {
      this.wsServer.clients.forEach(connection => {
        if (!connection.isAlive) {
          const monitor = this.clientArray.find(client => client.connection === connection)
          this.clientArray = this.clientArray.filter(
            client => client.connection !== connection
          )
          this.log.info(`Closing connection for monitor ${monitor.target}`)
          this.activeChains.removeMonitor({monitor})
          this.activeChains.clientInfos = this.getClientInfos()
          connection.terminate()
        }
        else {
          connection.isAlive = false
          connection.ping()
        }
      })
    }, 30000)
    return this.wsServer
  }

  stopServer () {
    clearInterval(this.intervalId)
    this.wsServer.close()
  }

  sendMessage ({message, target}) {
    const targetClient = this.clientArray
      .filter(Boolean)
      .find(client => client.target === target)
    if (targetClient) {
      this.log.info(`Send ${message} to ${target}`)
      targetClient.connection.send(message)
      return true
    }
    return false
  }
}


module.exports = BlockchainController
