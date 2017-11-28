const cors = require('cors')
const express = require('express')
const NodeCache = require('node-cache')
const path = require('path')


module.exports = () => {
  const ethereumPublic = require('../components/publicChains/aggregator.js')
  const log = console

  const app = express()

  const cache = new NodeCache({stdTTL: 60, errorOnMissing: true})

  app.use(cors())
  app.get('/api/ethereum/publicStat', async (request, response) => {
    cache.get('ethereumPublicStat', async (error, value) => {
      if (!error) {
        log.info('Access cache via key.')
        response.send(value)
      }
      else {
        log.info(`Cache access error: ${error}`)
        const data = await ethereumPublic({chainName: 'ethereum'})
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
    log.info('Frontend interface running on port 2020')
  })
}