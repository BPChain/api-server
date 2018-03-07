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

  let parsedJson
  try {
    parsedJson = JSON.parse(json)
  }
  catch (error) {
    return false
  }

  const hasAllKeys = expectedKeys.every((item) => {
    const keyExists = parsedJson.hasOwnProperty(item)
    if (!keyExists) {
      log.error(`Missing key in backend JSON: ${item}`)
    }
    return keyExists
  })

  if (!hasAllKeys) {
    return false
  }

  return (parsedJson.isMining === 1 || parsedJson.isMining === 0) &&
    isNumeric(parsedJson.hashrate) &&
    isNumeric(parsedJson.avgBlocktime) &&
    isNumeric(parsedJson.gasPrice) &&
    isNumeric(parsedJson.avgDifficulty)
}
