const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getAvgBlocktime () {
  try {
    const avgBlocktime =
    (await axios.get(config.ethereum.publicChain.averageBlockTime))
      .data.data
    return avgBlocktime
  }
  catch (error) {
    log.info('!!! Can not reach api.nanopool.org')
    return 0
  }
}

module.exports = getAvgBlocktime
