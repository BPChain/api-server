/*
 A helper that contains all aggregation methods for private chain data
 so that the bufferAggregator does not need to contain the logic itself
*/

exports.initializeBuffer = (connection, chainName, filledBufferName, Schema) =>
  connection.model(`${chainName}_private${filledBufferName}`, Schema)

exports.inintializeStorage = (connection, chainName, StorageSchema) =>
  connection.model(`${chainName}_private_storage`, StorageSchema)

exports.createStorage = (Storage, chainName, aggregatedValues) => {
  return new Storage(
    Object.assign({
      chainName: chainName,
      timeStamp: Date.now(),
    },
    aggregatedValues,
    ))
}

exports.aggregateNumberOfMiners = async (Buffer, chainName) => {
  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
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

exports.aggregateNumberOfHosts = async (Buffer, chainName) => {

  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
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

async function aggregateAverage (Buffer, chainName, field) {

  const result = await Buffer
    .aggregate(
      [{
        $match: {chainName: chainName.toLowerCase()},
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

exports.aggregateAverageHashRate = async (Buffer, chainName) => {
  return await aggregateAverage(Buffer, chainName, 'hashrate')
}

exports.aggregateAverageBlockTime = async (Buffer, chainName) => {
  return await aggregateAverage(Buffer, chainName, 'avgBlocktime')
}

exports.aggregateAverageGasPrice = async (Buffer, chainName) => {
  return await aggregateAverage(Buffer, chainName, 'gasPrice')
}

exports.aggregateAverageDifficulty = async (Buffer, chainName) => {
  return await aggregateAverage(Buffer, chainName, 'avgDifficulty')
}
