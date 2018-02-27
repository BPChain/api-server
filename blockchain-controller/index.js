const BlockchainController = require('./BlockchainController')
const FrontendInterface = require('./FrontendInterface')


const log = console
const backendPort = 4040
const dockernetPort = 40404

const blockchainController = new BlockchainController({log, port: backendPort})
blockchainController.start()
const frontendInterface = new FrontendInterface(
  {log, port: dockernetPort, blockchainController})
frontendInterface.start()
