function isNumeric (number) {
  return !isNaN(parseFloat(number)) && isFinite(number)
}

const expectedKeys = [
  'startChain',
  'stopChain',
  'numberOfHosts',
  'numberOfMiners',
  'switchChainTo',
  'scenario',
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
  if (!hasOnlyExpectedkeys(json)) {
    log.warn(`Json has not only expected keys ${json} | ${expectedKeys}`)
    return false
  }
  return Object.keys(json)
    .every(key => {
      if (['startChain', 'stopChain', 'switchChainTo'].includes(key)) {
        return !isNumeric(json[key])
      }
      else if (['scenario'].includes(key)) {
        return Object.keys(json[key])
          .every(subKey => {
            if (['frequency', 'payloadSize'].includes(subKey)) {
              return isNumeric(json[key][subKey])
            }
            else {
              return false
            }
          })
      }
      return isNumeric(json[key])
    })
}
