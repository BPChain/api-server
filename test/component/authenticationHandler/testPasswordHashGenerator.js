/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const expect = require('chai').expect
const hashGenerator = require('../../../components/authenticationHandler/passwordHashGenerator')


const password = 'abc'
const hashToNotExpect = 'f4caa423c20262e67c3fc929d23e3b94b69c7000302287f64d63e03a952c91b66e65d07964d82333a05b3c3eca27720f57ad727dff77cfa7c3108b857e998e59'
const saltToNotExpect = 'ceac5f7da35c78ba'

describe('password hash generation', () => {
  describe('#pashwordHashing()', () => {
    it('should return a function()', () => {
      expect(hashGenerator).to.be.a('function')
    })
    it('should throw error with empty options', () => {
      expect(() => hashGenerator()).to.throw(TypeError)
    })
    it('should return no expected hash value', async () => {
      assert.notEqual(hashGenerator({ password }), { salt: saltToNotExpect, password: hashToNotExpect })
    })
    it('should return the expected hash and salt legth', async () => {
      const hash = hashGenerator({ password })
      assert.equal(hash.salt.length, 16)
      assert.equal(hash.password.length, 128)
    })
  })
})
