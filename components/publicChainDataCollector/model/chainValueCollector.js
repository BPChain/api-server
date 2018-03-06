const accessNanopool = require('./ethereum/accessNanopool')
const apiFields = require('./ethereum/apiFields')

module.exports = async ({chainName, config, log}) => {
  const values = await Promise.all(apiFields
    .map(async field => {
      const result = {}
      const value = await accessNanopool({config, log, field})
      result[field] = value
      return result
    }))
  const result = Object.assign(
    ...values,
    {
      timeStamp: (new Date)
        .toUTCString(),
      chain: chainName,
    },
  )
  return result
}
