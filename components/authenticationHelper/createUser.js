const passwordHashGenerator = require('./passwordHashGenerator')
const userSchema = require('./userSchema')

module.exports = async (options = {}) => {
  const {
    connection,
    log,
    username,
    password,
  } = options

  const User = connection.model('usertable', userSchema)

  const secret = passwordHashGenerator({ password })
  const user = new User({
    timestamp: Date.now(),
    username: username,
    password: secret.password,
    salt: secret.salt,
  })

  return await user.save((error) => {
    if (error) {
      log.error(error)
      return false
    }
    log.info('Successfully saved user.')
    return true
  })
}
