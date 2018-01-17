const axios = require('axios')

const config = require('../../../src/config.js')

async function getNumberOfWorkers (options = {}) {

  const {log} = options

  try {
    const numberOfWorkers =
    (await axios.get(config.ethereum.publicChain.activeWorkers))
      .data.data
    return numberOfWorkers
  }
  catch (error) {
    log.warn('!!! Can not reach api.nanopool.org (NumberOfWorkers')
    return 0
  }
}

module.exports = getNumberOfWorkers
