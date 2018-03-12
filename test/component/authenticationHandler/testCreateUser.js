/* eslint-disable max-len */

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const createUser = require('../../../components/authenticationHandler/createUser')
const log = console
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = require('chai').expect


const password = 'abc'
const username = 'some'

/* eslint-disable no-unused-vars */
const optionsA = {
  username,
  password,
  connection: {
    model: (string, type) => {
      return class User {
        static findOne (object, callbackFunction) {
          callbackFunction(false, true)
        }
        static findOneAndUpdate (query, user, opts, callbackFunction) {
          callbackFunction(false, true)
        }
        lines () { }
        save () { }
      }
    },
  },
  log,
}

const optionsB = {
  username,
  password,
  connection: {
    model: (string, type) => {
      return class User {
        static findOne (object, callbackFunction) {
          callbackFunction(true, false)
        }
        static findOneAndUpdate (query, user, opts, callbackFunction) {
          callbackFunction(true, false)
        }
        lines () { }
        save () { }
      }
    },
  },
  log,
}

const optionsC = {
  username,
  password,
  connection: {
    model: (string, type) => {
      return class User {
        static findOne (object, callbackFunction) {
          callbackFunction(false, false)
        }
        static findOneAndUpdate (query, user, opts, callbackFunction) {
          callbackFunction(true, false)
        }
        lines () { }
        save () { }
      }
    },
  },
  log,
}

const optionsD = {
  username,
  password,
  connection: {
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
  },
  log,
}

const optionsE = {
  username,
  password,
  connection: {
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
  },
  log,
}

describe('validateUser', () => {
  before(() => {
    log.info('Start testing user validation')
  })
  describe('#validateUser()', () => {
    it('should throw error with empty options', async () => {
      return expect(createUser()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return false when password does not match', async () => {
      assert.equal(await createUser(optionsA), false)
    })
    it('should return false when username lookup fails', async () => {
      assert.equal(await createUser(optionsB), false)
    })
    it('should return false when user insertion errors', async () => {
      assert.equal(await createUser(optionsC), false)
    })
    it('should return false when user insertion does not yield a result', async () => {
      assert.equal(await createUser(optionsD), false)
    })
    it('should return true when username is free and user insertion succeeds', async () => {
      assert.equal(await createUser(optionsE), true)
    })
  })
  after(() => {
    log.info('End testing user validation')
  })
})
