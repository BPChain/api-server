/* eslint-disable max-len */

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const passwordEncryption = require('../../../components/authenticationHandler/passwordHashing')
const log = console
const expect = require('chai').expect



const hashToExpect = '58585acd673067f96bea32a1c57bf3fc3fd5a42678567e72d5cb0ab7f08ea41dcf3a41af96c53948e13184ae6fe6cd0b8b4193fc593dfb2693b00c2b0ee7a316'
const password = 'abc'
const salt = '123'

describe('passwordHashing', () => {
  before(() => {
    log.info('Start testing password hashing')
  })
  describe('#pashwordHashing()', () => {
    it('should throw an error with empty options', async () => {
      expect(() => passwordEncryption()).to.throw(TypeError)
    })
    it('should return the expected hash value', async () => {
      assert.equal(passwordEncryption({password, salt}), hashToExpect)
    })
  })
  after(() => {
    log.info('End testing password hashing')
  })
})
