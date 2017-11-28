const path = require('path')

module.exports = async (options = {}) => {

  const {chainName = 'ethereum'} = options

  const basePath = path.join(__dirname, chainName)

  const activeMiners = require(
    path.join(basePath, 'activeMiners.js')
  )
  const activeWorkers = require(
    path.join(basePath, 'activeWorkers.js')
  )
  const averageBlockTime = require(
    path.join(basePath, 'averageBlockTime.js')
  )
  const blockTimeDifficulty = require(
    path.join(basePath, 'blockTimeDifficulty.js')
  )
  const hashRate = require(
    path.join(basePath, 'hashRate.js')
  )
  const timeToNextEpoch = require(
    path.join(basePath, 'timeToNextEpoch.js')
  )

  return {
    activeMiners: await activeMiners(),
    activeWorkers: await activeWorkers(),
    averageBlockTime: await averageBlockTime(),
    blockTimeDifficulty: await blockTimeDifficulty(),
    hashRate: await hashRate(),
    timeToNextEpoch: await timeToNextEpoch(),
  }
  
}
