const chainValueCollector = require('./chainValueCollector')

const log = console

module.exports = async (options = {}) => {

  const {
    chainName,
    schema,
    connection,
  } = options


  const Storage = connection.model(`${chainName}_storage`, schema)

  setInterval(async () => {
    const dataLine = new Storage(
      await chainValueCollector({chainName: 'ethereum'})
    )
    dataLine.save((error, savedData) => {
      if (error) {
        log.info(error)
        throw error
      }
      else {
        log.info('Successfully stored public data: ', savedData)
        return 0
      }
    })



    const result = await connection.db.collection('ethereum_storages')

    const data = await result
      .find({})
      .toArray()

    log.info('My saved data is:', data)
  }, 10000)
}
