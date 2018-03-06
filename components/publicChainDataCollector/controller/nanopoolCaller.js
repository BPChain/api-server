const chainValueCollector = require('../model/chainValueCollector')
<<<<<<< HEAD
=======

module.exports = async (options = {}) => {
  const {
    chainName,
    schema,
    connection,
    config,
    log,
  } = options
>>>>>>> Use config from parameters instead of opening file

module.exports = ({chainName, schema, connection, config, log}) => {
  const Storage = connection.model(`${chainName}_public_storage`, schema)

  return setInterval(async () => {
    const line = await chainValueCollector({chainName, config, log})
    const dataLine = new Storage(line)
    dataLine.save((error, savedData) => {
      if (error) {
        log.error(`Could not store dataLine: ${error}`)
      }
      else {
        log.info('Successfully stored aggregated public data.')
        log.debug(`Stored aggregated public data: ${savedData}`)
      }
    })
  }, config.publicPollTime)
}
