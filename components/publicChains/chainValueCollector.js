const path = require('path')
const fse = require('fs-extra')


module.exports = async (options = {}) => {
  const {chainName} = options

  const basePath = path.join(__dirname, chainName)
  const files = await fse.readdir(basePath)

  const object = (await Promise.all(files
    .map(async (file) => {
      const filePath = path.join(basePath, file)
      const result = await require(filePath)()
      return {file: file.replace(/\.js$/, ''), result}
    })))
    .reduce((result, item) => {
      result[item.file] = item.result
      return result
    }, {})

  return Object.assign(object, {
    timeStamp: (new Date)
      .toUTCString(),
    chain: chainName,
  })
}
