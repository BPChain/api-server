const isodate = require('isodate')

const logHTMLGenerator = require('../src/logHTMLGenerator')

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

    const data = await collection
      .find(query)
      .limit(numberOfItems)
      .sort({timeStamp: -1})
      .toArray()


    response.send(await logHTMLGenerator({data}))
  }
}
