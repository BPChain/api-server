const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getActiveMiners () {
  try {
    const activeMiners =
    (await axios.get(config.ethereum.activeMiners))
      .data.data
    return activeMiners
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getActiveMiners
