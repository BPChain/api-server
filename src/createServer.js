/*
  Create privateChain, publicChain and frontend components
*/

const frontendRouting = require('../components/frontendRouting')
const privateChainCollector =
  require('../components/privateChainDataCollector/controller/listener')
const publicChainCollector =
  require('../components/publicChainDataCollector/controller/nanopoolCaller')
const privateChainConfigurator =
  require('../components/privateChainConfigurator/controller/listener')
const activeChain =
  require('../components/privateChainDataCollector/model/activeChain')

module.exports = async (options = {}) => {
  const {
    connection,
    activeChainName,
    config,
    log,
  } = options

  activeChain.set(activeChainName)

  privateChainConfigurator.startServer({
    log,
    port: config.controllerPort,
    activeChain,
  })
  privateChainCollector({
    schema: config.ethereum.privateChain.schema,
    activeChain,
    connection,
    log,
  })
  publicChainCollector({
    chainName: 'ethereum',
    schema:
      require(
        '../components/publicChainDataCollector/model/ethereumStorage.js'
      ),
    connection,
    log,
  })
  frontendRouting({
    privateChainHandler: privateChainCollector,
    activeChain,
    connection,
    log,
  })
}
