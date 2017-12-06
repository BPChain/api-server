module.exports = async (options = {}) => {

  const {
    chainName,
    connection,
  } = options

  const result = await connection.db.collection(`${chainName}_public_storages`)

  const data = await result
    .find({})
    .toArray()

  const dataLine = data[data.length - 1]

  return dataLine
}
