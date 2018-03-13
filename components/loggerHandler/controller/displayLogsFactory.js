const isodate = require('isodate')

const logHTMLGenerator = require('../../../logger/logHTMLGenerator')

module.exports = ({connection}) => {
  return async (request, response) => {
    const {
      logLevel,
      startTime,
      endTime,
    } = request.query
    const numberOfItems = parseInt(request.query.numberOfItems) || 1000
    const logTranslation = {
      'trace': 10,
      'debug': 20,
      'info': 30,
      'warn': 40,
      'error': 50,
      'fatal': 60,
    }
    const logNumber = logTranslation[logLevel] || 10
    const collection = await connection.db
      .collection('logs')

    let query = {}

    query = Object.assign(query, {logLevel: {$gte: logNumber}})

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
