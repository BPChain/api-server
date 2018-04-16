
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
        const scenario = active
          ? activeChains
            .getChains()
            .find(item => item.chainName === client.chainName && item.target === client.target)
            .scenario
          : {}
        return Object.assign(client, {
          accessability: 'private',
          active,
          scenario,
        })
      })
    response.send(privateChains)
  }
}
