function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

/*
  Checks whether JSON provided by private nodes has all expected keys
*/

module.exports = function isValidJson (options = {}) {
  const {json, log} = options
  const expectedKeys = [
    'chainName',
    'hostId',
    'isMining',
    'hashrate',
    'avgBlocktime',
    'gasPrice',
    'avgDifficulty',
  ]

  const hasAllKeys = expectedKeys.every((item) => {
    const keyExists = json.hasOwnProperty(item)
    if (!keyExists) {
      log.error(`Missing key in backend JSON: ${item}`)
    }
    return keyExists
  })

  if (!hasAllKeys) {
    return false
  }

  return (json.isMining === 1 || json.isMining === 0) &&
    isNumeric(json.hashrate) &&
    isNumeric(json.avgBlocktime) &&
    isNumeric(json.gasPrice) &&
    isNumeric(json.avgDifficulty)
}
