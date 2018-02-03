const config = require('../../config')
let activeChain = null

module.exports = {
  set: (chain) => {
    if (config.activePrivateChains.includes(chain)) {
      activeChain = chain
      return true
    }
    return false
  },
  get: () => {
    return activeChain
  },
}
