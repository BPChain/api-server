/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const userHandler = require('../../../components/authenticationHandler/userHandler')
const validateUser = userHandler.validateUser
const expect = require('chai').expect


const hashToExpect = '58585acd673067f96bea32a1c57bf3fc3fd5a42678567e72d5cb0ab7f08ea41dcf3a41af96c53948e13184ae6fe6cd0b8b4193fc593dfb2693b00c2b0ee7a316'
const password = 'abc'
const wrongPassword = 'cde'
const salt = '123'
const username = 'some'
const wrongUsername = 'other'


const errorMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(true, '')
      },
    }
  },
}

const dataMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(false, {password: hashToExpect, salt: salt})
      },
    }
  },
}

const falseDataMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(false, {password: 'wrongPasswordHash', salt: 'wrongSalt'})
      },
    }
  },
}

const noDataMockConnection = {
  model: () => {
    return {
      findOne: (object, string, callbackFunction) => {
        callbackFunction(false, '')
      },
    }
  },
}

describe('validateUser', () => {
  describe('#validateUser()', () => {
    it('should throw an error with empty options', async () => {
      expect(validateUser()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return false when password does not match', async () => {
      assert.equal(await validateUser({username, password, connection: errorMockConnection}), false)
    })
    it('should return true when username and password matches', async () => {
      assert.equal(await validateUser({username, password, connection: dataMockConnection}), true)
    })
    it('should return false when username and password do not match', async () => {
      assert.equal(await validateUser({username: wrongUsername, password: wrongPassword, connection: dataMockConnection}), false)
    })
    it('should return false when username is not provided', async () => {
      assert.equal(await validateUser({username: '', password, connection: dataMockConnection}), false)
    })
    it('should return false when password is not provided', async () => {
      assert.equal(await validateUser({username, password: '', connection: dataMockConnection}), false)
    })
    it('should return false when no data is returned', async () => {
      assert.equal(await validateUser({username, password, connection: noDataMockConnection}), false)
    })
    it('should return false when the false data is returned', async () => {
      assert.equal(await validateUser({username, password, connection: falseDataMockConnection}), false)
    })
  })
})
