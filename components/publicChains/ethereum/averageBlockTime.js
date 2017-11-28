const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getAverageBlockTime () {
  try {
    const blocktime =
    (await axios.get(config.ethereum.averageBlockTime))
      .data.data
    return blocktime
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getAverageBlockTime
