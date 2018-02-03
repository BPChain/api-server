const axios = require('axios')

const config = require('../../../config.js')

async function getNumberOfWorkers (options = {}) {

  const {log} = options

  try {
    const numberOfWorkers =
    (await axios.get(config.ethereum.publicChain.activeWorkers))
      .data.data
    return numberOfWorkers
  }
  catch (error) {
    log.warn(`Can not reach ${config.ethereum.publicChain.activeWorkers}`)
    return 0
  }
}

module.exports = getNumberOfWorkers
