const axios = require('axios')

// const config = require('../../../src/config.js')
const log = console

async function getAverageBlockTime () {
  try {
    const blocktime =
    (await axios.get(/*config.ethereum.averageBlockTime*/ 'https://api.nanopool.org/v1/eth/network/avgblocktime'))
      .data.data
      .toString()
    return blocktime
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getAverageBlockTime
