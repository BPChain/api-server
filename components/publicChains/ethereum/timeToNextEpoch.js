const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getTimeToNextEpoch () {
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
