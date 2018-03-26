
module.exports = ({backendController, activeChain}) => {
  return (request, response) => {
    const privateChains = backendController
      .getClientInfos()
      .map(chain => {
        return Object.assign(chain, {
          accessability: 'private',
          active: chain.name === activeChain.get(),
        })
      })
    response.send(privateChains)
  }
}
