/*
  Create privateChain, publicChain and frontend components
*/

const frontendRouting = require('../components/frontendRouting')
const publicChainCollector =
  require('../components/publicChainDataCollector/controller/nanopoolCaller')
const BlockchainController =
  require('../components/privateChainConfigurator/controller/BlockchainController')
const ActiveChains =
  require('../components/privateChainDataCollector/model/ActiveChains')
const commonStorage = require('../components/publicChainDataCollector/model/commonStorage.js')

module.exports = ({connection, config, log}) => {
  const activeChains = new ActiveChains({config, connection, log})
  const server = {}
  const privateChainConfigurator = new BlockchainController({
    activeChains,
    log,
    port: config.ports.controller,
  })
  privateChainConfigurator.start()
  server.privateChainConfigurator = privateChainConfigurator
  server.publicChainCollector = publicChainCollector({
    chainName: 'ethereum',
    schema: commonStorage,
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
