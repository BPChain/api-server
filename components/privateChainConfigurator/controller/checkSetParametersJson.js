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
  let keysAreGood = true
  Object.keys(json)
    .forEach((key) => {
      if (!expectedKeys.includes(key)) {
        keysAreGood = false
      }
    })
  return keysAreGood
}

/*
  Checks whether JSON provided by setParameters has expected Keys and values
*/

module.exports = function isValidJson ({json, log}) {
  log.info('Check whether setParameters json is valid')
  let parsedJson
  try {
    parsedJson = JSON.parse(json)
    if (Object.keys(parsedJson).length === 0) {
      return false
    }
  }
  catch (error) {
    return false
  }
  if (!hasOnlyExpectedkeys(parsedJson)) {
    return false
  }
  const allKeysValid = Object.keys(parsedJson)
    .every(key => {
      if (key === 'startChain' || key === 'stopChain' || key === 'switchChainTo') {
        return !isNumeric(parsedJson[key])
      }
      else if (key === 'numberOfHosts' || key === 'numberOfMiners') {
        return isNumeric(parsedJson[key])
      }
      return false
    })
  return allKeysValid
}
