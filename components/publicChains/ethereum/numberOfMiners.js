const axios = require('axios')

const config = require('../../../src/config.js')

async function getNumberOfMiners (options = {}) {

  const {log} = options

  try {
    const numberOfMiners =
    (await axios.get(config.ethereum.publicChain.activeMiners))
      .data.data
    return numberOfMiners
  }
  catch (error) {
    log.warn('!!! Can not reach api.nanopool.org (NumberOfMiners)')
    return 0
  }
}

module.exports = getNumberOfMiners
