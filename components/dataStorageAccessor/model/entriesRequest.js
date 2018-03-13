const itemNumberLimiter = require('./itemNumberLimiter')

module.exports = async (options = {}) => {
  let {numberOfItems} = options
  const {
    connection,
    chainName,
    accessibility,
  } = options

  const result = await connection.db
    .collection(`${chainName}_${accessibility}_storages`)

  numberOfItems = itemNumberLimiter(numberOfItems)

  const data = await result
    .find({})
    .limit(numberOfItems)
    .sort({timeStamp: -1})
    .toArray()

  return data.reverse()
}
