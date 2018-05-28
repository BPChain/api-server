const crypto = require('crypto')
const Schema = require('mongoose').Schema

module.exports.passwordHashGenerator = ({password}) => {
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

module.exports.passwordEncryption = ({password, salt}) => {
  const hash = crypto.createHmac('sha512', salt.toString())
  hash.update(password.toString())
  return hash.digest('hex')
}

module.exports.userSchema = new Schema(
  {
    timestamp: {type: Number},
    username: {type: String},
    password: {type: String},
    salt: {type: String},
  },
  {
    _id: false,
    autoIndex: false,
  })

module.exports.createUser = async (options = {}) => {
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

  const User = await connection.model('usertable', this.userSchema)

  const secret = this.passwordHashGenerator({password})
  const user = new User({
    timestamp: Date.now(),
    username,
    password: secret.password,
    salt: secret.salt,
  })

  const query = {username: user.username}

  if (await isUserPresent()) {
    return false
  }
  return await insertUserPromise()


  async function isUserPresent () {
    let isAlreadyPresent = false
    await User.findOne(query, (error, result) => {
      if (error) {
        log.error(error)
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

    return isAlreadyPresent
  }

  async function insertUserPromise () {
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
}

module.exports.createUserRoute = ({connection, log}) => {
  return async (request, response) => {
    const {
      username,
      password,
    } = request.body

    const success = await this.createUser({
      connection,
      log,
      username,
      password,
    })
    if (success) {
      log.debug('Returning success')
      response.sendStatus(200)
    }
    else {
      log.debug('Returning failure')
      response.sendStatus(500)
    }
  }
}

module.exports.validateUser = async ({username, password, connection}) => {
  const User = await connection.model('usertables', this.userSchema)

  if (!username || !password) {
    return false
  }

  const promise = new Promise(resolve => {
    User.findOne({'username': username}, 'password salt', (error, data) => {
      if (error || !data) {
        return resolve(false)
      }
      const result = data.password === this.passwordEncryption({
        password,
        salt: data.salt,
      })
      return resolve(result)
    })
  })
  return await promise
}
