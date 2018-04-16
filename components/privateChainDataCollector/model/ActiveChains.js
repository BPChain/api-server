/*
  Holds state of active chain and checks if valid chain is selected
*/

module.exports = class ActiveChains {

  constructor ({config}) {
    this.activeChains = [/*
      {
        chainName: 'ethereum',
        target: 'rx600s5-2',
        scenario: {name: '', period: 2.3, payloadSize: 3},
      },*/
    ]
    this.config = config
    this.emptyScenario = {name: 'noScenario', period: 0, payloadSize: 0}
  }

  add ({chainName, target}) {
    if (this.config.activePrivateChains.includes(chainName)) {
      this.activeChains.push({chainName, target, scenario: this.emptyScenario})
    }
    else {
      throw new Error(`Unable to add chain ${chainName}`)
    }
  }

  setScenario ({chainName, target, scenario}) {
    this.activeChains
      .find(item => item.chainName === chainName && item.target === target)
      .scenario = scenario
  }

  remove ({chainName, target}) {
    this.activeChains = this.activeChains.filter(item =>
      item.chainName !== chainName || item.target !== target
    )
  }

  removeChainsOf ({target}) {
    this.activeChains = this.activeChains.filter(item => item.target !== target)
  }

  getChains () {
    return this.activeChains
  }
}
