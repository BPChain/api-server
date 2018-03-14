
module.exports = backendController =>
  (request, response) => {
    response.send(backendController.getClientNames())
  }
