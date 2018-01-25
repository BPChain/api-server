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

    let logNumber = 10

    switch (logLevel) {
    case 'trace': {logNumber = 10} break
    case 'debug': {logNumber = 20} break
    case 'info': {logNumber = 30} break
    case 'warn': {logNumber = 40} break
    case 'error': {logNumber = 50} break
    case 'fatal': {logNumber = 60} break
    default: {logNumber = 10} break
    }

    const collection = await connection.db
      .collection('logs')

    if (!numberOfItems) {
      numberOfItems = 1000
    }

    let query = {}

    if (logLevel) {
      query = Object.assign(query, {logLevel: {$gte: logNumber}})
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
