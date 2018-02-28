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

exports.getAggregatedValues = function () {
  return {
    numberOfHosts: 0,
    numberOfMiners: 0,
    avgHashrate: 0,
    avgBlocktime: 0,
    avgGasPrice: 0,
    avgDifficulty: 0,
  }
}

exports.createStorage = function (Storage, chainName, aggregatedValues) {
  return new Storage({
    chain: chainName,
    timeStamp: (new Date())
      .toUTCString(),
    numberOfHosts: aggregatedValues.numberOfHosts,
    numberOfMiners: aggregatedValues.numberOfMiners,
    avgHashrate: aggregatedValues.avgHashrate,
    avgBlocktime: aggregatedValues.avgBlocktime,
    avgGasPrice: aggregatedValues.avgGasPrice,
    avgDifficulty: aggregatedValues.avgDifficulty,
  })
}

exports.aggregateNumberOfMiners =   async function  (Buffer, chainName, aggregatedValues) {
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
  if (result.length) {
    aggregatedValues.numberOfMiners = result[0].count
  }
}

exports.aggregateNumberOfHosts = async function (Buffer, chainName, aggregatedValues) {

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
  if (result.length) {
    aggregatedValues.numberOfHosts = result[0].count
  }
}

async function aggregateAverage (Buffer, chainName, aggregatedValues, aggregationOptions) {

  const {
    field,
    target,
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
  if (result.length) {
    aggregatedValues[target] = result[0].avgValue
  }
}

exports.aggregateAverageHashRate = async function (Buffer, chainName, aggregatedValues) {
  return await aggregateAverage(Buffer, chainName, aggregatedValues, {
    field: 'hashrate',
    target: 'avgHashrate',
  })
}

exports.aggregateAverageBlockTime = async function (Buffer, chainName, aggregatedValues) {
  return await aggregateAverage(Buffer, chainName, aggregatedValues, {
    field: 'avgBlocktime',
    target: 'avgBlocktime',
  })
}

exports.aggregateAverageGasPrice = async function (Buffer, chainName, aggregatedValues) {
  return await aggregateAverage(Buffer, chainName, aggregatedValues, {
    field: 'gasPrice',
    target: 'avgGasPrice',
  })
}

exports.aggregateAverageDifficulty = async function (Buffer, chainName, aggregatedValues) {
  return await aggregateAverage(Buffer, chainName, aggregatedValues, {
    field: 'avgDifficulty',
    target: 'avgDifficulty',
  })
}
