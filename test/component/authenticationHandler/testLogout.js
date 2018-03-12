/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const logout = require('../../../components/authenticationHandler/logout')


const mockRequest = {
  session: {
    destroy: () => {},
  },
}

const failureRequest = {
  session: {
    destroy: () => {
      throw new Error('some error')
    },
  },
}

const mockSuccess = {
  status: () => {
    return {
      send: () => {
        throw new Error('success')
      },
    }
  },
}

const mockFailure = {
  status: () => {
    return {
      send: () => {
        throw new Error('failed to log out')
      },
    }
  },
}

describe('logout', () => {
  describe('#logout()', () => {
    it('should return a function()', () => {
      expect(logout).to.be.a('function')
    })
    it('should allow authenticated requests', async () => {
      expect(() => logout(mockRequest, mockSuccess)).to.throw('success')
    })
    it('should recognize unauthorized requests', async () => {
      expect(() => logout(failureRequest, mockFailure)).to.throw('failed to log out')
    })
  })
})
