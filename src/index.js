const frontendHandler = require('./frontendInterface')
const backendHandler = require('../components/privateChains/backendListener')
const config = require('../src/config')

backendHandler({
  chainName: config.ethereum.privateChain.name,
  schema: config.ethereum.privateChain.schema,
})
frontendHandler()
