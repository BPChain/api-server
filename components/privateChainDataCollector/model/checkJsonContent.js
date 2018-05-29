/*
  Checks whether JSON provided by private nodes has all expected keys
*/

function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

const expectedKeys = [
  'chainName',
  'hostId',
  'isMining',
  'hashrate',
  'avgBlocktime',
  'avgTransactions',
  'blockSize',
  'avgDifficulty',
  'cpuUsage',
]

function hasAllKeys ({json}) {
  return expectedKeys.every(item => {
    const keyExists = json.hasOwnProperty(item)
    if (!keyExists) {
      throw new Error(`Missing key in backend JSON: ${item}`)
    }
    return keyExists
  })
}

module.exports = function isValidJson ({json}) {
  return hasAllKeys({json}) &&
    (json.isMining === 1 || json.isMining === 0) &&
    isNumeric(json.hashrate) &&
    isNumeric(json.avgBlocktime) &&
    isNumeric(json.blockSize) &&
    isNumeric(json.avgDifficulty) &&
    isNumeric(json.cpuUsage) &&
    isNumeric(json.avgTransactions)
}
