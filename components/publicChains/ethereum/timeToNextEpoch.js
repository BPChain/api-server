const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getTimeToNextEpoch () {
  try {
    const timeToNextEpoch =
    (await axios.get(config.ethereum.timeToNextEpoch))
      .data.data
    return timeToNextEpoch
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getTimeToNextEpoch
