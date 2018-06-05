/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const loginLogoutHandler = require('../../../components/authenticationHandler/loginLogoutHandler')
const logout = loginLogoutHandler.logout


const mockRequest = {
  session: {
    destroy: () => {},
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

describe('logout', () => {
  describe('#logout()', () => {
    it('should return a function()', () => {
      expect(logout).to.be.a('function')
    })
    it('should be able to log out users', async () => {
      expect(() => logout(mockRequest, mockSuccess)).to.throw('success')
    })
  })
})
