const isodate = require('isodate')

module.exports = async (options = {}) => {
  const {
    connection,
    chainName,
    accessibility,
    startTime,
    endTime,
  } = options

  const result = await connection.db
    .collection(`${chainName}_${accessibility}_storages`)

  return await result
    .find({
      timeStamp: {
        $gte: isodate(startTime),
        $lt: isodate(endTime),
      },
    })
    .toArray()
}
