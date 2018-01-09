const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getAvgHashrate () {
  try {
    const avgHashrate =
    (await axios.get(config.ethereum.publicChain.hashRate))
      .data.data
    return avgHashrate
  }
  catch (error) {
    log.info('!!! Can not reach api.nanopool.org')
    return 0
  }
}

module.exports = getAvgHashrate
