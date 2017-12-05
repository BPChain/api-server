const frontendHandler = require('./frontendInterface')
const backendHandler = require('../components/privateChains/backendListener')
const mongoConnector = require('./mongoConnector')
const publicChainHandler = require('../components/publicChains/publicListener')
const config = require('../src/config')

const privateConnection = mongoConnector
  .connect('mongodb://mongodb/privateChains')
const publicConnection = mongoConnector
  .connect('mongodb://mongodb/publicChains')


backendHandler({
  chainName: config.ethereum.privateChain.name,
  schema: config.ethereum.privateChain.schema,
  connection: privateConnection,
})
publicChainHandler({
  chainName: 'ethereum',
  schema: require('../schemas/publicChains/ethereumStorage.js')(),
  connection: publicConnection,
})

frontendHandler({
  privateConnection,
  publicConnection,
})
