const axios = require('axios')

const config = require('../../../src/config.js')
const log = console

async function getBlockTimeDifficulty () {
  try {
    const blockTimeDifficulty =
    (await axios.get(config.ethereum.blockTimeDifficulty))
      .data.data
    return blockTimeDifficulty
  }
  catch (error) {
    log.info(error)
    return NaN
  }
}

module.exports = getBlockTimeDifficulty
