/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const userHandler = require('../../../components/authenticationHandler/userHandler')
const userCreationRouteFactory = userHandler.createUserRoute
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
const password = 'abc'
const username = 'some'

const successConnection = {
  model: (string, type) => {
    return class User {
      static findOne (object, callbackFunction) {
        callbackFunction(false, false)
      }
      static findOneAndUpdate (query, user, opts, callbackFunction) {
        callbackFunction(false, true)
      }
      lines () { }
      save () { }
    }
  },
}
const failureConnection = {
  model: (string, type) => {
    return class User {
      static findOne (object, callbackFunction) {
        callbackFunction(false, false)
      }
      static findOneAndUpdate (query, user, opts, callbackFunction) {
        callbackFunction(false, false)
      }
      lines () { }
      save () { }
    }
  },
}

const request = {
  body: {
    password,
    username,
  },
}

const successMockResponse = {
  sendStatus: () => {
    throw new Error('user created')
  },
}

const failureMockResponse = {
  sendStatus: () => {
    throw new Error('user creation failed')
  },
}


describe('userCreationRouteFactory', () => {
  describe('#userCreationRouteFactory()', () => {
    it('should throw an error when options are empty', async () => {
      const userRoute = userCreationRouteFactory({})
      return expect(userRoute(request, successMockResponse)).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return expected response when user can be created', async () => {
      const userRoute = userCreationRouteFactory({connection: successConnection, log})
      return expect(userRoute(request, successMockResponse)).to.eventually.be.rejectedWith('user created')
    })
    it('should return expected response when user can not be created', async () => {
      const userRoute = userCreationRouteFactory({connection: failureConnection, log})
      return expect(userRoute(request, failureMockResponse)).to.eventually.be.rejectedWith('user creation failed')
    })
  })
})
