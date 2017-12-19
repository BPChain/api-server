const path = require('path')

const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')

const config = require('./config')
const activeChainName = config.ethereum.privateChain.name

module.exports = (options = {}) => {

  const {
    connection,
  } = options

  const ethereumPublic = require('../components/publicChains/aggregator.js')
  const ethereumPrivate = require('../components/privateChains/aggregator.js')

  const log = console

  const app = express()

  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})

  app.use(cors())
  app.get('/api/ethereum/publicStat', async (request, response) => {
    const numberOfItems = request.query.numberOfItems
    const startTime = request.query.startTime
    const endTime = request.query.endTime

    if (numberOfItems || (startTime && endTime)) {
      const data = await ethereumPublic({
        chainName: activeChainName,
        connection,
        numberOfItems,
        startTime,
        endTime,
      })
      response.send(data)
    }
    else {
      cache.get(`${activeChainName}PublicStat`, async (error, value) => {
        if (!error) {
          log.info('# Access cache via key')
          response.send(value)
        }
        else {
          log.info('# Cache access error: No public chain data cached')
          const data = await ethereumPublic({
            chainName: activeChainName,
            connection,
            numberOfItems: 1,
          })
          response.send(data)
          cache.set('ethereumPublicStat', data, (cachingError, success) => {
            if (!cachingError && success) {
              log.info(`# New public ${activeChainName} data cached.`)
            }
          })
        }
      })
    }
  })

  app.get('/api/ethereum/privateStat', async (request, response) => {
    const numberOfItems = request.query.numberOfItems
    const startTime = request.query.startTime
    const endTime = request.query.endTime

    if (numberOfItems || (startTime && endTime)) {
      const data = await ethereumPrivate({
        chainName: activeChainName,
        connection,
        numberOfItems,
        startTime,
        endTime,
      })
      response.send(data)
    }
    else {
      cache.get(`${activeChainName}PrivateStat`, async (error, value) => {
        if (!error) {
          log.info('# Access cache via key')
          response.send(value)
        }
        else {
          log.info('# Cache access error: No private chain data cached')
          const data = await ethereumPrivate({
            chainName: activeChainName,
            connection,
            numberOfItems: 1,
          })
          response.send(data)
          cache.set('ethereumPrivateStat', data, (cachingError, success) => {
            if (!cachingError && success) {
              log.info(`# New private ${activeChainName} data cached.`)
            }
          })
        }
      })
    }
  })

  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'))
  })


  app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}
