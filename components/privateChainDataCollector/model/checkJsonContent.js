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

function hasAllKeys (object) {
  return expectedKeys.every(item => {
    const keyExists = object.hasOwnProperty(item)
    if (!keyExists) {
      throw new Error(`Missing key in backend JSON: ${item} in ${JSON.stringify(object)}`)
    }
    return keyExists
  })
}

module.exports = object => {
  return hasAllKeys(object) &&
    (object.isMining === 1 || object.isMining === 0) &&
    isNumeric(object.hashrate) &&
    isNumeric(object.avgBlocktime) &&
    isNumeric(object.blockSize) &&
    isNumeric(object.avgDifficulty) &&
    isNumeric(object.cpuUsage) &&
    isNumeric(object.avgTransactions)
}
