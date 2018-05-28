
module.exports = ({backendController, activeChains}) => {
  return (request, response) => {
    const privateChains = backendController
      .getClientInfos()
      .map(client => {
        const active = activeChains
          .getActiveChains()
          .some(item =>
            item.target === client.target &&
            client.chainName === item.chainName
          )
        const scenario = active
          ? activeChains
            .getScenario({chainName: client.chainName, target: client.target})
          : {}
        return Object.assign(client, {
          accessability: 'private',
          active,
          scenario,
          state: activeChains.getBackendState({
            monitor: client.target,
            chainName: client.chainName,
          }),
        })
      })
    response.send(privateChains)
  }
}
