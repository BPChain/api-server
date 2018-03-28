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
const ActiveChains =
  require('../components/privateChainDataCollector/model/ActiveChains')

module.exports = ({connection, config, log}) => {
  const activeChains = new ActiveChains({config})
  const server = {}
  const privateChainConfigurator = new BlockchainController({
    log,
    port: config.controllerPort,
  })
  privateChainConfigurator.start()
  server.privateChainConfigurator = privateChainConfigurator
  server.privateChainCollector = privateChainCollector({
    activeChains,
    log,
    config,
    connection,
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
    activeChains,
    connection,
    log,
  })
  return server
}
