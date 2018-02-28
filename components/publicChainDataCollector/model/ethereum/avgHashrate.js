const axios = require('axios')

const config = require('../../../../config')

async function getAvgHashrate (options = {}) {

  const {log} = options

  try {
    const avgHashrate =
    (await axios.get(config.ethereum.publicChain.hashRate))
      .data.data
    return avgHashrate
  }
  catch (error) {
    log.warn(`Can not reach ${config.ethereum.publicChain.hashRate}`)
    return 0
  }
}

module.exports = getAvgHashrate