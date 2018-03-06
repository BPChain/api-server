/*
  Create privateChain, publicChain and frontend components
*/

const frontendRouting = require('../components/frontendRouting')
const privateChainCollector =
  require('../components/privateChainDataCollector/controller/listener')
const publicChainCollector =
  require('../components/publicChainDataCollector/controller/nanopoolCaller')
const BlockchainController =
  require('../components/privateChainConfigurator/controller/BlockchainController')
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

  const privateChainConfigurator = new BlockchainController({
    log,
    port: config.controllerPort,
  })
  privateChainConfigurator.start()

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
    config,
    log,
  })
  frontendRouting({
    backendController: privateChainConfigurator,
    activeChain,
    connection,
    log,
  })
}
