const frontendHandler = require('./frontendInterface')
const privateChainHandler =
  require('../components/privateChains/backendListener')
const publicChainHandler = require('../components/publicChains/publicListener')

module.exports = async (options = {}) => {
  const {connection, config, log} = options

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
      connection,
      log,
    }),
  }
}
