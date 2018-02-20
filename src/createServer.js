const frontendHandler = require('../interface/frontend/frontendInterface')
const privateChainHandler =
  require('../components/privateChains/backendListener')
const publicChainHandler = require('../components/publicChains/publicListener')
const backendController = require('../interface/backend/backendController')
const activeChain = require('../components/privateChains/activeChain')

module.exports = async (options = {}) => {
  const {
    connection,
    activeChainName,
    config,
    log,
  } = options

  activeChain.set(activeChainName)

  backendController.startServer({
    log,
    port: config.controllerPort,
    activeChain,
  })

  const startPrivateChainHandler = privateChainHandler({
    schema: config.ethereum.privateChain.schema,
    activeChain,
    connection,
    log,
  })
  const startPublicChainHandler = publicChainHandler({
    chainName: 'ethereum',
    schema: require('../schemas/publicChains/ethereumStorage.js')(),
    connection,
    log,
  })
  const startFrontendHandler = frontendHandler({
    backendController,
    activeChain,
    connection,
    log,
  })

  return {
    startPrivateChainHandler,
    startPublicChainHandler,
    startFrontendHandler,
  }
}
