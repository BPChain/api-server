const itemNumberLimiter = require('./itemNumberLimiter')

module.exports = async (options = {}) => {
  let {numberOfItems} = options
  const {
    chainName = '',
    target = '',
    connection,
    accessibility,
  } = options

  const result = await connection.db
    .collection(`common_${accessibility}_storages`)

  numberOfItems = itemNumberLimiter(numberOfItems)

  const data = await result
    .find([
      {
        $match: {chainName: chainName.toLowerCase()},
      },
      {
        $match: {target: target.toLowerCase()},
      },
    ])
    .limit(numberOfItems)
    .sort({timeStamp: -1})
    .toArray()

  return data.reverse()
}
