/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const loginRouteFactory = require('../../../components/authenticationHandler/loginRouteFactory')
const log = {
  info: () => {},
  error: () => {},
  debug: () => {},
}

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect

/* eslint-disable no-unused-vars*/


const hashToExpect = '58585acd673067f96bea32a1c57bf3fc3fd5a42678567e72d5cb0ab7f08ea41dcf3a41af96c53948e13184ae6fe6cd0b8b4193fc593dfb2693b00c2b0ee7a316'
const password = 'abc'
const wrongPassword = 'cde'
const salt = '123'
const username = 'some'
const wrongUsername = 'other'

const successMockResponse = {
  status: () => {
    return {
      send: () => {
        throw new Error('authorized request')
      },
    }
  },
}


const successDataMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(false, { password: hashToExpect, salt: salt })
      },
    }
  },
}

const successSessionCache = {
  set: (string, boolean, callbackFunction) => {
    callbackFunction(false, true)
  },
}

const failedSessionCache = {
  set: (string, boolean, callbackFunction) => {
    callbackFunction(true, false)
  },
}

const successRequest = {
  body: {
    username: username,
    password: password,
  },
  sessionId: '123',
}


const falseDataMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(false, { password: 'wrongPasswordHash', salt: 'wrongSalt' })
      },
    }
  },
}

const failureMockResponse = {
  status: () => {
    return {
      send: () => {
        throw new Error('unauthorized request')
      },
    }
  },
}

const failedLogInMockResponse = {
  status: () => {
    return {
      send: () => {
        throw new Error('failed to log in')
      },
    }
  },
}

const cacheErrorMockResponse = {
  status: () => {
    return {
      send: () => {
        throw new Error('error when caching session')
      },
    }
  },
}


const failureRequest = {
  body: {
    username: wrongUsername,
    password: wrongPassword,

  },
  sessionId: '123',
}

describe('loginRouteFactory', () => {
  describe('#loginRouteFactory()', () => {
    it('should return expected response when user can log in', async () => {
      const loginRoute = loginRouteFactory({ connection: successDataMockConnection, log, sessionCache: successSessionCache })
      return expect(loginRoute(successRequest, successMockResponse)).to.eventually.be.rejectedWith('authorized request')
    })
    it('should throw error with empty options', async () => {
      const loginRoute = loginRouteFactory()
      return expect(loginRoute(successRequest, successMockResponse)).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return expected response when user can log in and session cache failed', async () => {
      const loginRoute = loginRouteFactory({ connection: successDataMockConnection, log, sessionCache: failedSessionCache })
      return expect(loginRoute(successRequest, successMockResponse)).to.eventually.be.rejectedWith('authorized request')
    })
    it('should return expected response when user can not log in', async () => {
      const loginRoute = loginRouteFactory({ connection: successDataMockConnection, log, sessionCache: successSessionCache })
      return expect(loginRoute(failureRequest, failedLogInMockResponse)).to.eventually.be.rejectedWith('failed to log in')
    })
    it('should return expected response when user is not in database', async () => {
      const loginRoute = loginRouteFactory({ connection: falseDataMockConnection, log, sessionCache: successSessionCache })
      return expect(loginRoute(successRequest, failureMockResponse)).to.eventually.be.rejectedWith('authorized request')

    })
    it('should return expected response when caching session returns an error', async () => {
      const loginRoute = loginRouteFactory({ connection: falseDataMockConnection, log, sessionCache: successSessionCache })
      return expect(loginRoute(successRequest, cacheErrorMockResponse)).to.eventually.be.rejectedWith('error when caching session')
    })
  })
})
