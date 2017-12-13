module.exports = async (options = {}) => {
  const {
    chainName,
    connection,
    numberOfItems,
  } = options

  const result = await connection.db
    .collection(`${chainName}_private_storages`)

  const data = await result
    .find({})
    .toArray()

  const lines = data.slice(Math.max(data.length - numberOfItems, 1))

  const dataLine = lines.map((line) => {
    return Object.assign(line, {chain: chainName})
  })

  return dataLine
}
