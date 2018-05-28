/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const expect = require('chai').expect
const loginLogoutHandler = require('../../../components/authenticationHandler/loginLogoutHandler')
const authMiddleware = loginLogoutHandler.authenticate


const mockRequest = {
  isAuthenticated: true,
}

const mockIllegalRequest = {
  isAuthenticated: false,
}

const mockResponse = {
  sendStatus: () => {
    throw new Error('unauthorized request')
  },
}

function mockNext () {
  return true
}

describe('authenticationMiddleware', () => {
  describe('#authenticationMiddleware()', () => {
    it('should return a function()', () => {
      expect(authMiddleware).to.be.a('function')
    })
    it('should allow authenticated requests', async () => {
      assert.equal(authMiddleware(mockRequest, mockResponse, mockNext), true)
    })
    it('should recognize unauthorized requests', async () => {
      expect(() => authMiddleware(mockIllegalRequest, mockResponse, mockNext)).to.throw('unauthorized request')
    })
  })
})
