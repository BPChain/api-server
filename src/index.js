const axios = require('axios')
const express = require('express')
const path = require('path')

const ethereumPublic = require('../components/public/ethereum/aggregator.js')
const app = express()
const log = console 

app.get('/api/ethereum/publicStat', async (request, response) => {
  
  response.send(await ethereumPublic())  
})


app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'))
})


app.listen(2020, () => {
  log.info('running server on 2020')
})
