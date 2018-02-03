const axios = require('axios')

const config = require('../../../config.js')

async function getTimeToNextEpoch (options = {}) {

  const {log} = options

  try {
    const timeToNextEpoch =
    (await axios.get(config.ethereum.publicChain.timeToNextEpoch))
      .data.data
    return timeToNextEpoch
  }
  catch (error) {
    log.warn(`Can not reach ${config.ethereum.publicChain.timeToNextEpoch}`)
    return 0
  }
}

module.exports = getTimeToNextEpoch
