const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')
const path = require('path')
const ws = require('ws')

const ethereumPublic = require('../components/public/ethereum/aggregator.js')

const app = express()
const log = console 
const cache = new NodeCache({stdTTL: 60, errorOnMissing: true})

let privateData = {}

const WebSocketServer = ws.Server
const wsServer = new WebSocketServer({port: 3030})
wsServer.on('connection', (socket) => {
  socket.on('message', (message) => {
    log.info('received: %s', message)
    try {
      privateData = JSON.parse(message)
      socket.send(200)
    } 
    catch (error) {
      log.info(error)
      socket.send(415)
    } 
  })
})


app.use(cors())
app.get('/api/ethereum/publicStat', async (request, response) => {
  cache.get('ethereumPublicStat', async (error, value) => {
    if (!error) {
      log.info('Access cache via key.')
      response.send(value)
    }
    else {
      log.info('Cache access error: ' + error)
      const data = await ethereumPublic()
      response.send(data)
      cache.set('ethereumPublicStat', data, (cachingError, success) => {
        if (!cachingError && success) {
          log.info('New public ethereum data cached.')
        }
      })
    }
  })  
})

app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})


app.listen(2020, () => {
  log.info('running server on 2020')
})
