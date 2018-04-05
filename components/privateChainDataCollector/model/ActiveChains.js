/*
  Holds state of active chain and checks if valid chain is selected
*/

module.exports = class ActiveChains {

  constructor ({config}) {
    this.activeChains = [
    //  {chainName: 'ethereum', target: 'rx600s5-2'},
    ]
    this.config = config
  }

  add ({chainName, target}) {
    if (this.config.activePrivateChains.includes(chainName)) {
      this.activeChains.push({chainName, target})
    }
    else {
      throw new Error(`Unable to add chain ${chainName}`)
    }
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
