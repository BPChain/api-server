const crypto = require('crypto')

module.exports = ({password}) => {
  const saltLength = 16

  const salt = crypto.randomBytes(Math.ceil(saltLength / 2))
    .toString('hex')
    .slice(0, saltLength)

  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)

  return {
    salt: salt,
    password: hash.digest('hex'),
  }
}
