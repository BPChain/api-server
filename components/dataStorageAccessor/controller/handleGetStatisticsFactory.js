/*
  Factory method for route function for statistics api
*/
module.exports = (options = {}) => {
  const {
    connection,
    log,
    aggregator,
  } = options

  return async (request, response) => {
    const {chainName, accessibility} = request.params
    const {startTime, endTime} = request.query
    const numberOfItems = parseInt(request.query.numberOfItems)

    if (!isNaN(Date.parse(startTime)) && !isNaN(Date.parse(endTime))) {
      log.trace(`Access ${accessibility} items ${startTime}||${endTime}`)
      const data = await aggregator({
        chainName,
        accessibility,
        connection,
        numberOfItems,
        startTime,
        endTime,
      })
      response.send(data)
    }
    else if (Number.isInteger(numberOfItems) && numberOfItems > 0) {
      log.trace(`Access last ${numberOfItems} ${accessibility} items`)
      const data = await aggregator({
        chainName,
        accessibility,
        connection,
        numberOfItems,
        startTime: false,
        endTime: false,
      })
      response.send(data)
    }
    else {
      const data = await aggregator({
        chainName,
        accessibility,
        connection,
        numberOfItems: 1,
        startTime: false,
        endTime: false,
      })
      response.send(data)
    }
  }
}
