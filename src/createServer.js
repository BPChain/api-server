/*
  Create privateChain, publicChain and frontend components
*/

const frontendHandler = require('../component/frontendRouting')
const privateChainHandler =
  require('../component/privateChainDataCollector/controller/listener')
const publicChainCollector =
  require('../component/publicChainDataCollector/controller/nanopoolCaller')
const privateChainConfigurator =
  require('../component/privateChainConfigurator/controller/listener')
const activeChain =
  require('../component/privateChainDataCollector/model/activeChain')

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
  const privateChainHandlerInstance = privateChainHandler({
    schema: config.ethereum.privateChain.schema,
    activeChain,
    connection,
    log,
  })
  const publicChainCollectorInstance = publicChainCollector({
    chainName: 'ethereum',
    schema: require('../component/publicChainDataCollector/model/ethereumStorage.js'),
    connection,
    log,
  })
  const frontendHandlerInstance = frontendHandler({
    privateChainHandler,
    activeChain,
    connection,
    log,
  })

  return {
    privateChainConfigurator,
    privateChainHandlerInstance,
    publicChainCollectorInstance,
    frontendHandlerInstance,
  }
}
