/*
  Factory method for route function for statistics api
*/
module.exports = (options = {}) => {
  const {
    cache,
    connection,
    log,
    aggregator,
  } = options

  return async (request, response) => {
    const {chainName, accessibility} = request.params
    const {startTime, endTime} = request.query
    const numberOfItems = parseInt(request.query.numberOfItems)

    if (accessibility !== 'public' && accessibility !== 'private') {
      response.sendStatus(400)
      return
    }

    if (!(isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime)))) {
      log.trace(
        `Access ${accessibility} items ${startTime}||${endTime} without cache`
      )
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
      log.trace(
        `Access last ${numberOfItems} ${accessibility} items without cache`
      )

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
      cache.get(`${chainName}${accessibility}Cache`, async (error, value) => {
        if (!error) {
          log.trace('Access cache via key')
          response.send(value)
        }
        else {
          log.trace(
            `Cache access error: No ${accessibility} chain data cached`
          )
          const data = await aggregator({
            chainName,
            accessibility,
            connection,
            numberOfItems: 1,
            startTime: false,
            endTime: false,
          })
          response.send(data)
          cache.set(
            `${chainName}${accessibility}Cache`,
            data,
            (cachingError, success) => {
              if (cachingError) {
                log.error(
                  `Error: ${accessibility} ${chainName} can't be cached:
                  ${cachingError}`
                )
                response.sendStatus(404)
                return
              }
              if (success) {
                log.trace(`New ${accessibility} ${chainName} data cached.`)
              }
            })
        }
      })
    }
  }
}
