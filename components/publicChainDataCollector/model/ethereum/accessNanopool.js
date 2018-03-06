const axios = require('axios')

module.exports = async ({config, log, field}) => {
  const url = config.ethereum.publicChain[field]
  try {
    return (await axios.get(url))
      .data.data
  }
  catch (error) {
    log.warn(`Use default value 0: Can not reach ${url}, ${error.message}`)
    return 0
  }
}
