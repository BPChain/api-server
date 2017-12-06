const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getNumberOfMiners () {
  try {
    const numberOfMiners =
    (await axios.get(config.ethereum.publicChain.activeMiners))
      .data.data
    return numberOfMiners
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getNumberOfMiners
