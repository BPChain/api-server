const axios = require('axios')

const config = require('../../../src/config.js')

async function getTimeToNextEpoch (options = {}) {

  const {log} = options

  try {
    const timeToNextEpoch =
    (await axios.get(config.ethereum.publicChain.timeToNextEpoch))
      .data.data
    return timeToNextEpoch
  }
  catch (error) {
    log.info('!!! Can not reach api.nanopool.org')
    return 0
  }
}

module.exports = getTimeToNextEpoch
