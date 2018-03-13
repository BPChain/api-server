const passwordHashGenerator = require('./passwordHashGenerator')
const userSchema = require('./userSchema')

module.exports = async (options = {}) => {
  const {
    connection,
    log,
    username,
    password,
  } = options

  if (!password || !username) {
    log.info('Username or password was empty!')
    return false
  }

  const User = await connection.model('usertable', userSchema)

  const secret = passwordHashGenerator({password})
  const user = new User({
    timestamp: Date.now(),
    username,
    password: secret.password,
    salt: secret.salt,
  })

  const query = {username: user.username}

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

  if (isAlreadyPresent) {
    return false
  }

  const opts = {upsert: true, new: true, setDefaultsOnInsert: true}

  const promise = new Promise(resolve => {
    User.findOneAndUpdate(query, user, opts, (error, result) => {
      if (error) {
        log.error(error)
        return resolve(false)
      }
      else if (result) {
        log.info('Successfully saved user.')
        return resolve(true)
      }
      else {
        log.info('No new user was created.')
        return resolve(false)
      }
    })
  })
  return await promise
}
