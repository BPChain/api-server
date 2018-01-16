const axios = require('axios')

const config = require('../../../src/config.js')

async function getAvgHashrate (options = {}) {

  const {log} = options

  try {
    const avgHashrate =
    (await axios.get(config.ethereum.publicChain.hashRate))
      .data.data
    return avgHashrate
  }
  catch (error) {
    log.warn('!!! Can not reach api.nanopool.org')
    return 0
  }
}

module.exports = getAvgHashrate
