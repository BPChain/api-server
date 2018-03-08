const passwordHashGenerator = require('./passwordHashGenerator')
const userSchema = require('./userSchema')

module.exports = async (options = {}) => {
  const {
    connection,
    log,
    username,
    password,
  } = options

  const User = await connection.model('usertable', userSchema)

  const secret = passwordHashGenerator({ password })
  const user = new User({
    timestamp: Date.now(),
    username: username,
    password: secret.password,
    salt: secret.salt,
  })

  const query = { username: user.username }

  let isAlreadyPresent = false
  await User.findOne(query, (error, result) => {
    if (error) {
      log.debug(error)
      isAlreadyPresent = true
    }
    if (result) {
      log.info('Username is already taken.')
      isAlreadyPresent = true
    }
    else {
      log.info('Username is free.')
      isAlreadyPresent = false
    }
  })

  const opts = { upsert: true, new: true, setDefaultsOnInsert: true }

  if (isAlreadyPresent) {
    return false
  }
  const promise = new Promise((resolve) => {
    User.findOneAndUpdate(query, user, opts, (error, result) => {
      if (error) {
        log.error(error)
        resolve(false)
      }
      else if (result) {
        log.info('Successfully saved user.')
        resolve(true)
      }
      else {
        log.info('No new user was created.')
        resolve(false)
      }
    })
  })
  return await promise
}
