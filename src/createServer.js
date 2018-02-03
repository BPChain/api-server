const frontendHandler = require('../interface/frontend/frontendInterface')
const privateChainHandler =
  require('../components/privateChains/backendListener')
const publicChainHandler = require('../components/publicChains/publicListener')
const backendController = require('../interface/backend/backendController')
const activeChain = require('../components/privateChains/activeChain')

module.exports = async (options = {}) => {
  const {connection, config, log} = options

  activeChain.set(config.activePrivateChains[0])

  backendController.startServer({
    log,
    port: config.controllerPort,
    activeChain,
  })

  return {
    startPrivateChainHandler: privateChainHandler({
      chainName: config.ethereum.privateChain.name,
      schema: config.ethereum.privateChain.schema,
      connection,
      log,
    }),
    startPublicChainHandler: publicChainHandler({
      chainName: 'ethereum',
      schema: require('../schemas/publicChains/ethereumStorage.js')(),
      connection,
      log,
    }),
    startFrontendHandler: frontendHandler({
      backendController,
      activeChain,
      connection,
      log,
    }),
  }
}
