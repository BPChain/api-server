/* eslint-disable max-len */

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const expect = require('chai').expect
const authMiddleware = require('../../../components/authenticationHandler/authenticationMiddleware')
const log = console


const mockRequest = {
  isAuthenticated: true,
}

const mockIllegalRequest = {
  isAuthenticated: false,
}

const mockResponse = {
  sendStatus: ()  => {
    throw new Error('unauthorized request')
  },
}

function mockNext () {
  return true
}

describe('authenticationMiddleware', () => {
  before(() => {
    log.info('Start testing authentication middleware')
  })
  describe('#authenticationMiddleware()', () => {
    it('should return a function()', () => {
      const middleware = authMiddleware()
      expect(middleware).to.be.a('function')
    })
    it('should allow authenticated requests', async () => {
      const middleware = authMiddleware()
      assert.equal(middleware(mockRequest, mockResponse, mockNext), true)
    })
    it('should recognize unauthorized requests', async () => {
      const middleware = authMiddleware()
      expect(() => middleware(mockIllegalRequest, mockResponse, mockNext)).to.throw('unauthorized request')
    })

  })
  after(() => {
    log.info('End testing authentication middleware')
  })
})
