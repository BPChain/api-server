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

module.exports = function isValidJson (options = {}) {
  const {json, log} = options
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
  let allKeysValid = true
  Object.keys(parsedJson)
    .forEach((key) => {
      if (key === 'startChain' || key === 'stopChain' || key === 'switchChainTo') {
        allKeysValid =  !isNumeric(parsedJson[key]) && allKeysValid ? true : false
      }
      else if (key === 'numberOfHosts' || key === 'numberOfMiners') {
        allKeysValid = isNumeric(parsedJson[key]) && allKeysValid ? true : false
      }
    })
  return allKeysValid
}
