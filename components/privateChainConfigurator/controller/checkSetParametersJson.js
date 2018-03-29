function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

/*
  Checks whether JSON provided by setParameters has expected Keys and values
*/

module.exports = function isValidJson (options = {}) {
  const {json, log} = options
  const expectedKeys = [
    'startChain',
    'stopChain',
    'numberOfHosts',
    'numberOfMiners',
    'switchChainTo',
  ]

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

  log.info('Check whether setParameters Json is valid')

  let allKeysValid = true

  Object.keys(parsedJson)
    .forEach((key) => {
      if (expectedKeys.includes(key)) {
        if (key === 'startChain' || key === 'stopChain' || key === 'switchChainTo') {
          const thisKeyValid = !isNumeric(parsedJson[key])
          allKeysValid =  thisKeyValid && allKeysValid ? true : false
        }
        else if (key === 'numberOfHosts' || key === 'numberOfMiners') {
          const thisKeyValid = isNumeric(parsedJson[key])
          allKeysValid = thisKeyValid && allKeysValid ? true : false
        }
      }
    })
  return allKeysValid
}
