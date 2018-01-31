module.exports = (options = {}) => {
  const {backendControllerServer} = options

  return async (request, response) => {
    const {
      chain,
      parameter,
      value,
    } = request.body

    if (backendControllerServer.sendMessage({
      message: {
        chain,
        parameter,
        value,
      },
    })) {
      response.sendStatus(200)
    }
    response.sendStatus(400)
  }
}
