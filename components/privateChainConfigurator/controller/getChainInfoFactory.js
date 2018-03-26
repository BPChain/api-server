
module.exports = backendController =>
  (request, response) => {
    const responseList = []
    backendController.getClientNames()
    response.send(responseList)
  }
