module.exports = (request, response) => {
  try {
    request.session.destroy()
    response
      .status(200)
      .send('logged out')
  }
  catch (error) {
    response
      .status(500)
      .send('error')
  }
}
