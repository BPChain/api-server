const activeMiners = require('./activeMiners.js')
const activeWorkers = require('./activeWorkers.js')
const averageBlockTime = require('./averageBlockTime.js')
const blockTimeDifficulty = require('./blockTimeDifficulty.js')
const hashRate = require('./hashRate.js')
const timeToNextEpoch = require('./timeToNextEpoch.js')


async function getEthereumValues () {
  return {
    activeMiners: await activeMiners(),
    activeWorkers: await activeWorkers(),
    averageBlockTime: await averageBlockTime(),
    blockTimeDifficulty: await blockTimeDifficulty(),
    hashRate: await hashRate(),
    timeToNextEpoch: await timeToNextEpoch(),
  }
} 

module.exports = getEthereumValues
