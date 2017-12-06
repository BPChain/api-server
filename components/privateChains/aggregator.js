module.exports = async (options = {}) => {
  const {chainName, connection} = options

  const result = await connection.db
    .collection(`${chainName}_private_storages`)

  const data = await result
    .find({})
    .toArray()

  const line = data[data.length - 1]
  const dataLine = Object.assign(line, {chain: chainName})
  return dataLine
}
