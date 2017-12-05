const path = require('path')
const fse = require('fs-extra')

const log = console

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

  const result = Object.assign(object, {timestamp: Date.now(), chainName})
  log.info(object)
}
