/*
 A helper that contains all aggregation methods for private chain data
 so that the bufferAggregator does not need to contain the logic itself
*/

exports.initializeBuffer = function (connection, chainName, filledBuffer, Schema) {
  return connection
    .model(`${chainName}_private${filledBuffer}`, Schema)
}

exports.inintializeStorage = function (connection, chainName, StorageSchema) {
  return connection
    .model(`${chainName}_private_storage`, StorageSchema)
}

exports.createStorage = function (Storage, chainName, aggregatedValues) {
  return new Storage({
    chain: chainName,
    timeStamp: Date.now(),
    numberOfHosts: aggregatedValues.numberOfHosts,
    numberOfMiners: aggregatedValues.numberOfMiners,
    avgHashrate: aggregatedValues.avgHashrate,
    avgBlocktime: aggregatedValues.avgBlocktime,
    avgGasPrice: aggregatedValues.avgGasPrice,
    avgDifficulty: aggregatedValues.avgDifficulty,
  })
}

exports.aggregateNumberOfMiners =   async function  (Buffer, chainName) {
  const result = await Buffer
    .aggregate(
      [{
        $match: {chain: chainName.toLowerCase()},
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

exports.aggregateNumberOfHosts = async function (Buffer, chainName) {

  const result = await Buffer
    .aggregate(
      [{
        $match: {chain: chainName.toLowerCase()},
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

async function aggregateAverage (Buffer, chainName, aggregationOptions) {
  const {
    field,
  } = aggregationOptions

  const result = await Buffer
    .aggregate(
      [{
        $match: {chain: chainName.toLowerCase()},
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

exports.aggregateAverageHashRate = async function (Buffer, chainName) {
  return await aggregateAverage(Buffer, chainName, {
    field: 'hashrate',
  })
}

exports.aggregateAverageBlockTime = async function (Buffer, chainName) {
  return await aggregateAverage(Buffer, chainName, {
    field: 'avgBlocktime',
  })
}

exports.aggregateAverageGasPrice = async function (Buffer, chainName) {
  return await aggregateAverage(Buffer, chainName, {
    field: 'gasPrice',
  })
}

exports.aggregateAverageDifficulty = async function (Buffer, chainName) {
  return await aggregateAverage(Buffer, chainName, {
    field: 'avgDifficulty',
  })
}
