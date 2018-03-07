const crypto = require('crypto')

module.exports = (options = {}) => {
  const {password, salt} = options
  const hash = crypto.createHmac('sha512', salt.toString())
  hash.update(password.toString())
  return hash.digest('hex')
}
