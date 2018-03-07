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


  const query = { username: user.username }

  const isAlreadyPresent = await User.findOne(query, (error, result) => {
    if (error) {
      log.debug(error)
      return true
    }
    if (result) {
      log.info('Username is already taken.')
      return true
    }
    else {
      log.info('Username is free.')
      return false
    }
  })
  // const update = { expire: new Date() }
  const opts = { upsert: true, new: true, setDefaultsOnInsert: true }

  // Find the document
  if (!isAlreadyPresent) {
    return await User.findOneAndUpdate(query, user, opts, (error, result) => {
      if (error) {
        log.error(error)
        return false
      }
      else if (result) {
        log.info('Successfully saved user.')
        return true
      }
      else {
        log.info('No new user was created.')
        return false
      }
    })
  }
  else {
    return false
  }

}
