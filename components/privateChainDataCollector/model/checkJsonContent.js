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
  'blockSize',
  'avgDifficulty',
  'cpuUsage',
]

function hasAllKeys ({json, log}) {
  return expectedKeys.every(item => {
    const keyExists = json.hasOwnProperty(item)
    if (!keyExists) {
      log.error(`Missing key in backend JSON: ${item}`)
    }
    return keyExists
  })
}

module.exports = function isValidJson ({json, log}) {
  let parsedJson
  try {
    parsedJson = JSON.parse(json)
  }
  catch (error) {
    return false
  }

  return hasAllKeys({json: parsedJson, log}) &&
    (parsedJson.isMining === 1 || parsedJson.isMining === 0) &&
    isNumeric(parsedJson.hashrate) &&
    isNumeric(parsedJson.avgBlocktime) &&
    isNumeric(parsedJson.blockSize) &&
    isNumeric(parsedJson.avgDifficulty) &&
    isNumeric(parsedJson.cpuUsage)
}
