const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getAvgHashrate () {
  try {
    const avgHashrate =
    (await axios.get(config.ethereum.publicChain.hashRate))
      .data.data
    return avgHashrate
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getAvgHashrate
