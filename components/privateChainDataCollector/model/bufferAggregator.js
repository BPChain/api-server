/* eslint no-unused-vars: 0 */

/*
  Aggregates the provided buffer and stores it into the database
*/

const helper = require('./bufferAggregatorHelper')

module.exports = async (options = {}) => {
  const {
    chainName,
    target = 'rx600s5-2',
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
        aggregatedValues.numberOfHosts = await helper
          .aggregateNumberOfHosts(Buffer, chainName, target),
        aggregatedValues.numberOfMiners = await helper
          .aggregateNumberOfMiners(Buffer, chainName, target),
        aggregatedValues.avgHashrate = await helper
          .aggregateAverageHashRate(Buffer, chainName, target),
        aggregatedValues.avgBlocktime = await helper
          .aggregateAverageBlockTime(Buffer, chainName, target),
        aggregatedValues.avgBlockSize = await helper
          .aggregateAverageBlockSize(Buffer, chainName, target),
        aggregatedValues.avgDifficulty = await helper
          .aggregateAverageDifficulty(Buffer, chainName, target),
        aggregatedValues.avgCpuUsage = await helper
          .aggregateAverageCpuUsage(Buffer, chainName, target),
      ])
      .catch(log.error)

    await Buffer.collection.remove({})
    return aggregatedValues
  }

  function storeData (aggregatedValues) {
    const Storage = helper.intializeStorage({connection, StorageSchema})
    const dataLine = helper.createStorage({aggregatedValues, chainName, target, Storage})

    dataLine.save((error, savedData) => {
      if (error) {
        log.error(`Error occured while storing aggregated private data: ${error}`)
        throw error
      }
      else {
        log.info('Successfully stored aggregated private data')
        log.debug(`Stored aggregated private data: ${savedData}`)
      }
    })
  }
}
