
module.exports = ({backendController, activeChains}) => {
  return (request, response) => {
    const privateChains = backendController
      .getClientInfos()
      .map(client => {
        const active = activeChains
          .getChains()
          .some(item =>
            item.target === client.target &&
            client.chainName === item.chainName
          )
        return Object.assign(client, {
          accessability: 'private',
          active,
        })
      })
    response.send(privateChains)
  }
}
