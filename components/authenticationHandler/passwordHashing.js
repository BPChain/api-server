const crypto = require('crypto')

module.exports = ({password, salt}) => {
  const hash = crypto.createHmac('sha512', salt.toString())
  hash.update(password.toString())
  return hash.digest('hex')
}
