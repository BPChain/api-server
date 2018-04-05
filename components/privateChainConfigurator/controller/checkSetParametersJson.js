function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

const expectedKeys = [
  'startChain',
  'stopChain',
  'numberOfHosts',
  'numberOfMiners',
  'switchChainTo',
]

function hasOnlyExpectedkeys (json) {
  if (!Object.keys(json).length) {
    return false
  }
  return Object.keys(json)
    .every(key => expectedKeys.includes(key))
}

/*
  Checks whether JSON provided by setParameters has expected Keys and values
*/

module.exports = function isValidJson ({json, log}) {
  log.info('Check whether setParameters json is valid')
  let parsedJson
  try {
    parsedJson = JSON.parse(json)
  }
  catch (error) {
    return false
  }
  if (!hasOnlyExpectedkeys(parsedJson)) {
    return false
  }
  return Object.keys(parsedJson)
    .every(key => {
      if (['startChain', 'stopChain', 'switchChainTo'].includes(key)) {
        return !isNumeric(parsedJson[key])
      }
      return isNumeric(parsedJson[key])
    })
}
