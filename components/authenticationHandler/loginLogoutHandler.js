const NodeCache = require('node-cache')
const session = require('express-session')
const  userHandler = require('./userHandler')

module.exports.sessionCache = new NodeCache({
  stdTTL: 18000,
  checkperiod: 9000,
  errorOnMissing: false,
})

module.exports.userSession = session({
  secret: process.env.SESSION_SECRET || 'dummySecret',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 90000000},
  sameSite: true,
})

module.exports.checkUserSession = (sessionCache) => {
  return (request, response, next) => {
    sessionCache.get(request.sessionID, (error, value) => {
      if (!error) {
        if (value !== undefined) {
          request.isAuthenticated = true
          next()
        }
        else {
          request.isAuthenticated = false
          next()
        }
      }
      else {
        request.isAuthenticated = false
        next()
      }
    })
  }

}

module.exports.authenticate = (request, response, next) => {
  if (request.isAuthenticated) {
    return next()
  }
  response.sendStatus(401)
}

module.exports.logout = (request, response) => {
  request.session.destroy()
  response
    .status(200)
    .send('logged out')
}

module.exports.loginRouteFactory = (options = {}) => {
  const {
    connection,
    sessionCache,
    log,
  } = options

  return async (request, response) => {
    const {
      username,
      password,
    } = request.body

    if (await userHandler.validateUser({
      username,
      password,
      connection,
    })) {
      sessionCache.set(request.sessionID, true, (error, success) => {
        if (!error && success) {
          log.debug(`Authenticated new session: ${request.sessionID}`)
        }
        else {
          log.error(
            `Error occured trying to cache session: ${request.sessionID}`
          )
        }
      })
      response
        .status(200)
        .send('true')
    }
    else {
      log.debug('User could not be logged in.')
      response
        .status(200)
        .send('false')
    }
  }
}
