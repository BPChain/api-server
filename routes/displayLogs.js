const isodate = require('isodate')

module.exports = (options = {}) => {
  const {connection} = options

  return async (request, response) => {
    const {
      logLevel,
      startTime,
      endTime,
    } = request.query
    let numberOfItems = parseInt(request.query.numberOfItems)

    const collection = await connection.db
      .collection('logs')

    if (!numberOfItems) {
      numberOfItems = 1000
    }

    let query = {}

    if (logLevel) {
      query = Object.assign(query, {logLevel})
    }

    if (startTime && endTime) {
      query = Object.assign(
        query,
        {
          timeStamp: {
            $gte: isodate(startTime),
            $lt: isodate(endTime),
          },
        }
      )
    }

    console.info(query)

    const data = await collection
      .find(query)
      .limit(numberOfItems)
      .toArray()


    response.send(data)
  }
}
