/* eslint-disable max-len */

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const userCreationRouteFactory = require('../../../components/authenticationHandler/userCreationRouteFactory')
const log = console

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

const successMockRespones = {
  sendStatus: () => {
    throw new Error('user created')
  },
}

const failureMockRespones = {
  sendStatus: () => {
    throw new Error('user creation failed')
  },
}


describe('userCreationRouteFactory', () => {
  before(() => {
    log.info('Start testing userCreationRoute')
  })
  describe('#userCreationRouteFactory()', () => {
    it('should return expected response when user can be created', async () => {
      const userRoute = userCreationRouteFactory({ connection: successConnection, log})
      return expect(userRoute(request, successMockRespones)).to.eventually.be.rejectedWith('user created')
    })
    it('should return expected response when user can not be created', async () => {
      const userRoute = userCreationRouteFactory({ connection: failureConnection, log})
      return expect(userRoute(request, failureMockRespones)).to.eventually.be.rejectedWith('user creation failed')
    })
  })
  after(() => {
    log.info('End testing userCreationRoute')
  })
})
