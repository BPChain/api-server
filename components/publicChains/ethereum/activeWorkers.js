const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getActiveWorkers () {
  try {
    const activeWorkers =
    (await axios.get(config.ethereum.publicChain.activeWorkers))
      .data.data
    return activeWorkers
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getActiveWorkers
