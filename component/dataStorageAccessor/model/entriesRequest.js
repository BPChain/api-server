module.exports = async (options = {}) => {
  let {numberOfItems} = options
  const {
    connection,
    chainName,
    accessibility,
  } = options

  const result = await connection.db
    .collection(`${chainName}_${accessibility}_storages`)

  if (!numberOfItems) {
    numberOfItems = 1
  }
  else if (numberOfItems > 10000) {
    numberOfItems = 10000
  }

  const data = await result
    .find({})
    .limit(numberOfItems)
    .sort({timeStamp: -1})
    .toArray()
    .reverse()

  return data
}
