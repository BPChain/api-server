const isodate = require('isodate')

module.exports = async (options = {}) => {
  const {
    connection,
    accessibility,
    chainName = '',
    target = '',
    startTime,
    endTime,
  } = options

  const result = await connection.db
    .collection(`common_${accessibility}_storages`)
  return await result
    .find({
      chainName: chainName.toLowerCase(),
      target: target.toLowerCase(),
      timeStamp: {
        $gte: isodate(startTime),
        $lt: isodate(endTime),
      },
    })
    .toArray()
}
