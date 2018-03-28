const isodate = require('isodate')

module.exports = async (options = {}) => {
  const {
    connection,
    accessibility,
    startTime,
    endTime,
  } = options

  const result = await connection.db
    .collection(`common_${accessibility}_storages`)
  // TODO: filter by chainName and or target
  return await result
    .find({
      timeStamp: {
        $gte: isodate(startTime),
        $lt: isodate(endTime),
      },
    })
    .toArray()
}
