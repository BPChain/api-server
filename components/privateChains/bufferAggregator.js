const mongoose = require('mongoose')

const log = console

module.exports = async (options) => {
  const {chainName, filledBuffer, Schema, StorageSchema} = options

  log.info('Aggregate files from', filledBuffer)
  const Buffer = mongoose.model(`${chainName}${filledBuffer}`, Schema)
  const Storage = mongoose.model(`${chainName}_storage`, StorageSchema)

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

    return Buffer.aggregate([
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
      }],
    (error, result) => {
      if (error) {
        log.info(error)
        throw error
      }
      else {
        if (result.length) {
          aggregatedValues[target] = result[0].avgValue
        }
      }
    })
  }

  async function aggregateNumberOfHosts () {
    return Buffer.aggregate(
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
      }, (error, result) => {
        if (error) {
          log.info(error)
          throw error
        }
        else {
          if (result.length) {
            aggregatedValues.numberOfHosts = result[0].count
          }
        }
      })
  }

  async function aggregateNumberOfMiners () {
    return Buffer.aggregate(
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
      }], (error, result) => {
        if (error) {
          log.info(error)
          throw error
        }
        else {
          if (result.length) {
            log.info(result)
            aggregatedValues.numberOfMiners = result[0].count
          }
        }
      })
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
    timeStamp: Date.now(),
    numberOfHosts: aggregatedValues.numberOfHosts,
    numberOfMiners: aggregatedValues.numberOfMiners,
    avgHashrate: aggregatedValues.avgHashrate,
    avgBlocktime: aggregatedValues.avgBlocktime,
    avgGasPrice: aggregatedValues.avgGasPrice,
    avgDifficulty: aggregatedValues.avgDifficulty,
  })
  dataLine.save((error, savedData) => {
    if (error) {
      log.info(error)
      throw error
    }
    else {
      log.info('Successfully stored input: ', savedData)
      return 0
    }
  })
}
