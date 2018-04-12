/*
 A helper that contains all aggregation methods for private chain data
 so that the bufferAggregator does not need to contain the logic itself
*/

exports.initializeBuffer = ({connection, filledBufferName, Schema}) =>
  connection.model(`common_private${filledBufferName}`, Schema)

exports.intializeStorage = ({connection, StorageSchema}) =>
  connection.model('common_private_storage', StorageSchema)

exports.createStorage = ({aggregatedValues, chainName, target, Storage}) => {
  return new Storage(
    Object.assign({
      chainName,
      target,
      timeStamp: Date.now(),
    },
    aggregatedValues,
    )
  )
}

exports.aggregateNumberOfMiners = async (Buffer, chainName, target) => {
  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
      },
      {
        $match: {target: target.toLowerCase()},
      },
      {
        $match: {isMining: 1},
      },
      {
        $group: {
          _id: '$hostId',
        },
      },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      }])
    .exec()
  return result.length ? result[0].count : 0
}

exports.aggregateNumberOfHosts = async (Buffer, chainName, target) => {
  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
      },
      {
        $match: {target: target.toLowerCase()},
      },
      {
        $group: {
          _id: '$hostId',
        },
      },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      }])
    .exec()
  return result.length ? result[0].count : 0
}

async function aggregateAverage (Buffer, chainName, target, field) {

  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
      },
      {
        $match: {target: target.toLowerCase()},
      },
      {
        $group: {
          _id: '$hostId',
          avgHostValue: {$avg: `$${field}`},
        },
      },
      {
        $group: {
          _id: 1,
          avgValue: {$avg: '$avgHostValue'},
        },
      }])
    .exec()
  return result.length ? result[0].avgValue : 0
}

exports.aggregateAverageHashRate = async (Buffer, chainName, target) => {
  return await aggregateAverage(Buffer, chainName, target, 'hashrate')
}

exports.aggregateAverageBlockTime = async (Buffer, chainName, target) => {
  return await aggregateAverage(Buffer, chainName, target, 'avgBlocktime')
}

exports.aggregateAverageBlockSize = async (Buffer, chainName, target) => {
  return await aggregateAverage(Buffer, chainName, target, 'blockSize')
}

exports.aggregateAverageDifficulty = async (Buffer, chainName, target) => {
  return await aggregateAverage(Buffer, chainName, target, 'avgDifficulty')
}
