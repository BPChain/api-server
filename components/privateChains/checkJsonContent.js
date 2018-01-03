function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

module.exports = function checkJsonContent (options = {}) {
  const {json, log} = options
  const expectedKeys = [
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
      log.error('!!! Missing key in backend:', item)
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
