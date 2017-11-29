const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getHashrate () {
  try {
    const hashrate =
    (await axios.get(config.ethereum.publicChain.hashRate))
      .data.data
    return hashrate
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getHashrate
