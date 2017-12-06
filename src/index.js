const frontendHandler = require('./frontendInterface')
const backendHandler = require('../components/privateChains/backendListener')
const mongoConnector = require('./mongoConnector')
const publicChainHandler = require('../components/publicChains/publicListener')
const config = require('../src/config')

const connection = mongoConnector
  .connect('mongodb://mongodb/chainBoardDB')


backendHandler({
  chainName: config.ethereum.privateChain.name,
  schema: config.ethereum.privateChain.schema,
  connection,
})

publicChainHandler({
  chainName: 'ethereum',
  schema: require('../schemas/publicChains/ethereumStorage.js')(),
  connection,
})

frontendHandler({
  connection,
})
