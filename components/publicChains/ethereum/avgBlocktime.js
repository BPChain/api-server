const axios = require('axios')

const config = require('../../../src/config.js')

async function getAvgBlocktime (options = {}) {

  const {log} = options

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
