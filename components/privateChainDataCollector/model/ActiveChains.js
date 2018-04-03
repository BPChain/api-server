/*
  Holds state of active chain and checks if valid chain is selected
*/

module.exports = class ActiveChains {

  constructor ({config}) {
    this.activeChains = [
      {chainName: 'ethereum', target: 'computer'},
      {chainName: 'xain', target: 'computer'},
    ]
    this.config = config
  }

  add ({chainName, target}) {
    if (this.config.activePrivateChains.includes(chainName)) {
      this.activeChains.push({chainName, target})
      return true
    }
    return false
  }

  remove ({chainName, target}) {
    this.activeChains = this.activeChains.filter(item =>
      item.chainName === chainName && item.target === target
    )
  }
  getChains () {
    return this.activeChains
  }
}
