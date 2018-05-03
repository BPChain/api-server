const path = require('path')
const crypto = require('crypto')
const config = require('../../../config')

exports.upload = (request, response) => {
  if (!request.files) {
    response.sendStatus(400)
  }
  const file = request.file.scyllalog
  const name = crypto
    .createHash('sha512')
    .update(file.name)
    .digest('hex')
  const date = Date.now()
  file.mv(path.join(config.fileStorePath, `${date}_${name}`))
  response.send(200)
}