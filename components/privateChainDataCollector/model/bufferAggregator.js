/* eslint no-unused-vars: 0 */

/*
  Aggregates the provided buffer and stores it into the database
*/

const helper = require('./bufferAggregatorHelper')

module.exports = async (options = {}) => {
  const {
    chainName,
    filledBufferName,
    Schema,
    StorageSchema,
    connection,
    log,
  } = options


  const values = await aggregateValues()
  storeData(values)


  async function aggregateValues () {
    log.debug(`Aggregate files from ${filledBufferName}`)
    const Buffer = helper.initializeBuffer(options)

    const aggregatedValues = {}

    await Promise
      .all([
        aggregatedValues.numberOfHosts = await helper.aggregateNumberOfHosts(Buffer, chainName),
        aggregatedValues.numberOfMiners = await helper.aggregateNumberOfMiners(Buffer, chainName),
        aggregatedValues.avgHashrate = await helper.aggregateAverageHashRate(Buffer, chainName),
        aggregatedValues.avgBlocktime = await helper.aggregateAverageBlockTime(Buffer, chainName),
        aggregatedValues.avgGasPrice = await helper.aggregateAverageGasPrice(Buffer, chainName),
        aggregatedValues.avgDifficulty = await helper.aggregateAverageDifficulty(Buffer, chainName),
      ])
      .catch(log.error)

    await Buffer.collection.remove({})
    return aggregatedValues
  }


  function storeData (aggregatedValues) {
    const Storage = helper.inintializeStorage(options)
    const dataLine = helper.createStorage({aggregatedValues, chainName, Storage})

    dataLine.save((error, savedData) => {
      if (error) {
        log.error(`Error occured while storing aggregated private data: ${error}`)
        throw error
      }
      else {
        log.info('Successfully stored aggregated private data')
        log.debug(`Stored aggregated private data: ${savedData}`)
        return 0
      }
    })
  }
}
