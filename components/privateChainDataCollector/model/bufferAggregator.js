const helper = require('./bufferAggregatorHelper')

module.exports = async (options) => {
  const {
    chainName,
    filledBuffer,
    Schema,
    StorageSchema,
    connection,
    log,
  } = options

  log.trace(`Aggregate files from ${filledBuffer}`)
  const Buffer = connection
    .model(`${chainName}_private${filledBuffer}`, Schema)
  const Storage = connection
    .model(`${chainName}_private_storage`, StorageSchema)

  const aggregatedValues = helper.getAggregatedValues()

  await Promise
    .all([
      helper.aggregateNumberOfHosts(Buffer, chainName, aggregatedValues),
      helper.aggregateNumberOfMiners(Buffer, chainName, aggregatedValues),
      helper.aggregateAverageHashRate(Buffer, chainName, aggregatedValues),
      helper.aggregateAverageBlockTime(Buffer, chainName, aggregatedValues),
      helper.aggregateAverageGasPrice(Buffer, chainName, aggregatedValues),
      helper.aggregateAverageDifficulty(Buffer, chainName, aggregatedValues),
    ])
    .catch(log.error)

  await  Buffer.collection.remove({})


  const dataLine = helper.createStorage(Storage, chainName, aggregatedValues)

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
