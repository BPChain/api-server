const axios = require('axios')

const config = require('../../../config.js')

async function getAvgBlocktime (options = {}) {

  const {log} = options

  try {
    const avgBlocktime =
    (await axios.get(config.ethereum.publicChain.averageBlockTime))
      .data.data
    return avgBlocktime
  }
  catch (error) {
    log.warn(`Can not reach ${config.ethereum.publicChain.averageBlockTime}`)
    return 0
  }
}

module.exports = getAvgBlocktime
