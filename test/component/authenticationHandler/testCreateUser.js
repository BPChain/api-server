/* eslint-disable max-len */

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('assert')
const createUser = require('../../../components/authenticationHandler/createUser')
const log = {
  info: () => {},
  error: () => {},
  debug: () => {},
}
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
        lines () {}
        save () {}
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
        lines () {}
        save () {}
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
        lines () {}
        save () {}
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
        lines () {}
        save () {}
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
        lines () {}
        save () {}
      }
    },
  },
  log,
}

const optionsF = {
  username: '',
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
        lines () {}
        save () {}
      }
    },
  },
  log,
}

const optionsG = {
  username,
  password: '',
  connection: {
    model: (string, type) => {
      return class User {
        static findOne (object, callbackFunction) {
          callbackFunction(false, false)
        }
        static findOneAndUpdate (query, user, opts, callbackFunction) {
          callbackFunction(false, true)
        }
        lines () {}
        save () {}
      }
    },
  },
  log,
}

const optionsH = {
  username: undefined,
  password: null,
  connection: {
    model: (string, type) => {
      return class User {
        static findOne (object, callbackFunction) {
          callbackFunction(false, false)
        }
        static findOneAndUpdate (query, user, opts, callbackFunction) {
          callbackFunction(false, true)
        }
        lines () {}
        save () {}
      }
    },
  },
  log,
}

describe('createUser', () => {
  describe('#createUser()', () => {
    it('should throw error with empty options', async () => {
      return expect(createUser()).to.eventually.be.rejectedWith(TypeError)
    })
    it('should return false when user is already present', async () => {
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
    it('should return false when username and/or password is empty', async () => {
      assert.equal(await createUser(optionsF), false)
      assert.equal(await createUser(optionsG), false)
      assert.equal(await createUser(optionsH), false)
    })
  })
})
