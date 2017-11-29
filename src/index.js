const frontendHandler = require('./frontendInterface')
const backendHandler = require('../components/privateChains/backendListener')

backendHandler({chainName: 'ethereum', schema: 'ethereumschema'})
frontendHandler()
