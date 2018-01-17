module.exports = async (options) => {
  const {
    chainName,
    filledBuffer,
    Schema,
    StorageSchema,
    connection,
    log,
  } = options

  log.trace(`++ Aggregate files from ${filledBuffer}`)
  const Buffer = connection
    .model(`${chainName}_private${filledBuffer}`, Schema)
  const Storage = connection
    .model(`${chainName}_private_storage`, StorageSchema)

  const aggregatedValues = {
    numberOfHosts: 0,
    numberOfMiners: 0,
    avgHashrate: 0,
    avgBlocktime: 0,
    avgGasPrice: 0,
    avgDifficulty: 0,
  }

  async function aggregateAverage (aggregationOptions) {
    const {
      field,
      target,
    } = aggregationOptions

    const result = await Buffer
      .aggregate([
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

  async function aggregateNumberOfHosts () {

    const result = await Buffer
      .aggregate(
        [{
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

  async function aggregateNumberOfMiners () {

    const result = await Buffer
      .aggregate(
        [{
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


  await Promise
    .all([
      aggregateNumberOfHosts(),
      aggregateNumberOfMiners(),
      aggregateAverage({
        field: 'hashrate',
        target: 'avgHashrate',
      }),
      aggregateAverage({
        field: 'avgBlocktime',
        target: 'avgBlocktime',
      }),
      aggregateAverage({
        field: 'gasPrice',
        target: 'avgGasPrice',
      }),
      aggregateAverage({
        field: 'avgDifficulty',
        target: 'avgDifficulty',
      }),
    ])
    .catch(log.error)

  await  Buffer.collection.remove({})


  const dataLine = new Storage({
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

  dataLine.save((error, savedData) => {
    if (error) {
      log.error(`!!! Error occured while storing aggregated private data:
        ${error}`)
      throw error
    }
    else {
      log.info(
        `+++ Stored aggregated private data with TS: ${savedData.timeStamp}`
      )
      log.debug(`+++ Stored aggregated private data:
        ${savedData}`)
      return 0
    }
  })

}
