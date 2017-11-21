const averageBlockTime = require('./averageBlockTime.js')

async function getEthereumValues () {
  return {
    averageBlockTime: await averageBlockTime(),
  }
} 

module.exports = getEthereumValues
