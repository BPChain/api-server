const path = require('path')
const fse = require('fs-extra')


module.exports = async (options = {}) => {
  const {chainName, log} = options

  const basePath = path.join(__dirname, chainName)
  const files = await fse.readdir(basePath)

  let object = (await Promise.all(files
    .map(async (file) => {
      const filePath = path.join(basePath, file)
      const result = await require(filePath)({log})
      return {file: file.replace(/\.js$/, ''), result}
    })))
    .reduce((result, item) => {
      result[item.file] = item.result
      return result
    }, {})

  object = await Object.assign(object, {
    timeStamp: (new Date)
      .toUTCString(),
    chain: chainName,
  })

  try {
    const hasAllKeys = object.expectedKeys.every((item) => {
      const keyExists = object.hasOwnProperty(item)
      if (!keyExists) {
        log.error(`!!! Missing key in public JSON:
          ${item}`)
      }
      return keyExists
    })
    const expectedKeysDeleted = delete object.expectedKeys

    if (!hasAllKeys || !expectedKeysDeleted) {
      return null
    }
    return object
  }
  catch (error) {
    log.error(`!!! Error occured while collecting public data
      ${error}`)
    return null
  }
}
