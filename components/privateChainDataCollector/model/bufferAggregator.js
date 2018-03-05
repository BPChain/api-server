const helper = require('./bufferAggregatorHelper')

/*
  Aggregates the provided buffer and stores it in the database
*/

module.exports = async (options) => {
  const {
    chainName,
    filledBufferName,
    Schema,
    StorageSchema,
    connection,
    log,
  } = options

  log.debug(`Aggregate files from ${filledBufferName}`)
  const Buffer = helper.initializeBuffer(connection, chainName, filledBufferName, Schema)

  const result = {}

  await Promise
    .all([
      result.numberOfHosts = await helper.aggregateNumberOfHosts(Buffer, chainName),
      result.numberOfMiners = await helper.aggregateNumberOfMiners(Buffer, chainName),
      result.avgHashrate = await helper.aggregateAverageHashRate(Buffer, chainName),
      result.avgBlocktime = await helper.aggregateAverageBlockTime(Buffer, chainName),
      result.avgGasPrice = await helper.aggregateAverageGasPrice(Buffer, chainName),
      result.avgDifficulty = await helper.aggregateAverageDifficulty(Buffer, chainName),
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
