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

module.exports = ({connection, activeChainName, config, log}) => {
  const server = {}
  activeChain.set(activeChainName)
  const privateChainConfigurator = new BlockchainController({
    log,
    port: config.controllerPort,
  })
  server.privateChainConfigurator = privateChainConfigurator.start()
  server.privateChainCollector = privateChainCollector({
    activeChain,
    log,
    config,
    connection,
    schema: config.ethereum.privateChain.schema,
  })
  server.publicChainCollector = publicChainCollector({
    chainName: 'ethereum',
    schema:
      require(
        '../components/publicChainDataCollector/model/ethereumStorage.js'
      ),
    connection,
    config,
    log,
  })
  server.frontendRouting = frontendRouting({
    backendController: privateChainConfigurator,
    activeChain,
    connection,
    log,
  })
  return server
}
