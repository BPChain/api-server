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
  // TODO: filter by chainName and or target
  return await result
    .find([
      {
        $match: {chainName: chainName.toLowerCase()},
      },
      {
        $match: {target: target.toLowerCase()},
      },
      {
        timeStamp: {
          $gte: isodate(startTime),
          $lt: isodate(endTime),
        },
      },
    ])
    .toArray()
}
