/*
  Factory method for route function for statistics api
*/
module.exports = ({connection, aggregator}) => {
  return async (request, response) => {
    const {chainName, accessibility} = request.params
    const {startTime, endTime, target} = request.query
    const numberOfItems = parseInt(request.query.numberOfItems)
    let data = []
    const chainIdentifier = {
      chainName,
      target,
      accessibility,
    }
    if (!isNaN(Date.parse(startTime)) && !isNaN(Date.parse(endTime))) {
      data = await aggregator({
        ...chainIdentifier,
        connection,
        numberOfItems,
        startTime,
        endTime,
      })
    }
    else if (Number.isInteger(numberOfItems) && numberOfItems > 0) {
      data = await aggregator({
        ...chainIdentifier,
        connection,
        numberOfItems,
        startTime: false,
        endTime: false,
      })
    }
    else {
      data = await aggregator({
        ...chainIdentifier,
        connection,
        numberOfItems: 1,
        startTime: false,
        endTime: false,
      })
    }

    const result = data.reduce((object, entry) => {
      Object.keys(object)
        .forEach(element => {
          object[element].push(entry[element])
        })
      return object
    }, {
      numberOfHosts: [],
      numberOfMiners: [],
      avgHashrate: [],
      avgBlocktime: [],
      avgBlockSize: [],
      avgDifficulty: [],
      timeStamp: [],
    })
    response.send(Object.assign(result, {chainName}))
  }
}
