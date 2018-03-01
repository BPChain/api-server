const helper = require('./bufferAggregatorHelper')

/*
  Aggregates the provided buffer and stores it in the database
*/

module.exports = async (options) => {
  const {
    chainName,
    filledBuffer,
    Schema,
    StorageSchema,
    connection,
    log,
  } = options

  log.debug(`Aggregate files from ${filledBuffer}`)
  const Buffer = helper.initializeBuffer(connection, chainName, filledBuffer, Schema)

  const result = {}

  await Promise
    .all([
      result.numberOfHosts = helper.aggregateNumberOfHosts(Buffer, chainName),
      result.numberOfMiners = helper.aggregateNumberOfMiners(Buffer, chainName),
      result.avgHashrate = helper.aggregateAverageHashRate(Buffer, chainName),
      result.avgBlocktime = helper.aggregateAverageBlockTime(Buffer, chainName),
      result.avgGasPrice = helper.aggregateAverageGasPrice(Buffer, chainName),
      result.avgDifficulty = helper.aggregateAverageDifficulty(Buffer, chainName),
    ])
    .catch(log.error)

  await Buffer.collection.remove({})

  storeData(connection, chainName, StorageSchema, result, log)

}

function storeData (connection, chainName, StorageSchema, result, log) {
  const Storage = helper.inintializeStorage(connection, chainName, StorageSchema)
  const dataLine = helper.createStorage(Storage, chainName, result)

  dataLine.save((error, savedData) => {
    if (error) {
      log.error(`Error occured while storing aggregated private data:
        ${error}`)
      throw error
    }
    else {
      log.info(
        'Successfully stored aggregated private data'
      )
      log.debug(`Stored aggregated private data:
        ${savedData}`)
      return 0
    }
  })
}