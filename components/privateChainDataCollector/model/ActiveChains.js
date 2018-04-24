/*
  Holds state of active chain and checks if valid chain is selected
*/

module.exports = class ActiveChains {

  constructor ({config}) {
    this.config = config
    this.emptyScenario = {name: 'noScenario', period: 0, payloadSize: 0}
    this.backendState = {
      /*
        'rx600s5-2': {
          'ethereum': {
            miners: 0,
            hosts: 0,
          },
        }
      */
    }
    this.backendScenario = {
      /*
        'rx600s5-2': {
          'ethereum': {
            name: 'someName',
            period: 2.3,
            payloadSize: 222
          },
        }
      */
    }
  }

  setScenario ({chainName, target, scenario}) {
    this.backendScenario[target] = {}
    this.backendScenario[target][chainName] = scenario
  }

  getScenario ({chainName, target}) {
    try {
      return this.backendScenario[target][chainName]
    }
    catch (error) {
      return undefined
    }
  }

  getActiveChains () {
    return Object.keys(this.backendState)
      .reduce((result, target) => {
        return result.concat(Object.keys(this.backendState[target])
          .map(chainName => {
            return this.isChainActive({
              monitor: target,
              chainName}) ? {target, chainName, state: this.backendState[target][chainName]} : null
          })
          .filter(Boolean)
        )
      }, [])
  }

  getState ({monitor}) {
    return this.backendState[monitor]
  }

  getBackendState ({monitor, chainName}) {
    try {
      return this.backendState[monitor][chainName]
    }
    catch (error) {
      return {
        miners: 0,
        hosts: 0,
      }
    }
  }

  setState ({monitor, state}) {
    this.backendState[monitor] = state
  }

  removeMonitor ({monitor}) {
    this.backendState[monitor] = undefined
  }

  isChainActive ({monitor, chainName}) {
    try {
      const chainInfo = this.backendState[monitor][chainName]
      return chainInfo.hosts !== 0 || chainInfo.miners !== 0
    }
    catch (error) {
      return false
    }
  }
}
