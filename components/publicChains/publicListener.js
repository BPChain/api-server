const chainValueCollector = require('./chainValueCollector')


module.exports = async (options = {}) => {

  const {
    chainName,
    schema,
    connection,
    log,
  } = options


  const Storage = connection.model(`${chainName}_public_storage`, schema)

  setInterval(async () => {
    const line = await chainValueCollector({chainName, log})
    if (line) {
      const dataLine = new Storage(line)
      dataLine.save((error, savedData) => {
        if (error) {
          log.error(error)
          throw error
        }
        else {
          log.info('Successfully stored aggregated public data.')
          log.debug(`Stored aggregated public data:
            ${savedData}`)
          return 0
        }
      })
    }
  }, 30000)
}
