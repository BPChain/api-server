const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getNumberOfWorkers () {
  try {
    const numberOfWorkers =
    (await axios.get(config.ethereum.publicChain.activeWorkers))
      .data.data
    return numberOfWorkers
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getNumberOfWorkers
