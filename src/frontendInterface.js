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

  const privateAggregator = require('../components/privateChains/aggregator')
  const publicAggregator = require('../components/publicChains/aggregator')
  const createHandleGetStatistics = require('../routes/handleGetStatistics')


  const cache = new NodeCache({stdTTL: 5, errorOnMissing: true})
  const log = console


  const handleGetStatistics = createHandleGetStatistics({
    cache,
    connection,
    log,
    privateAggregator,
    publicAggregator,
  })

  const app = express()


  app.use(cors())
  app.get('/api/:accessibility/:chainName', handleGetStatistics)

  /* app.get('/api/private/:chainName', async (request, response) => {
    const chainName = request.params.chainName
    const numberOfItems = request.query.numberOfItems
    const startTime = request.query.startTime
    const endTime = request.query.endTime

    if (numberOfItems || (startTime && endTime)) {
      const data = await ethereumPrivate({
        chainName,
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
*/
  app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'))
  })


  app.listen(config.frontendPort, () => {
    log.info(`Frontend interface running on port ${config.frontendPort}`)
  })
}
