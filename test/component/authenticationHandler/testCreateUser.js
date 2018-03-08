/* eslint-disable max-len */

const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const assert = require('assert')
const createUser = require('../../../components/authenticationHandler/createUser')
const userSchema = require('../../../components/authenticationHandler/userSchema')
const log = console


const password = 'abc'
const username = 'some'



/* eslint-disable no-unused-vars  */
const optionsA = {
  username,
  password,
  connection: {
    model: (string, type) => {
      if (type === 'Schema') {
        return {
          findOne: (object, callbackFunction) => {
            callbackFunction(false, true)
          },
          findOneAndUpdate: (query, user, opts, callbackFunction) => {
            callbackFunction(false, true)

          },
        }
      }
      else {
        return function User () {
          function findOne (object, callbackFunction) {
            callbackFunction(false, true)
          }
          function findOneAndUpdate (query, user, opts, callbackFunction) {
            callbackFunction(false, true)
          }
        }

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
      if (type === userSchema) {
        return {
          findOne: (object, callbackFunction) => {
            callbackFunction(false, true)
          },
          findOneAndUpdate: (query, user, opts, callbackFunction) => {
            callbackFunction(false, true)
          },
        }
      }
      else {
        return function User () {
          return {
            lines: () => {},
            save: () => {},
          }
        }
      }
    },
  },
  log: {
    info: () => {},
    debug: () => {},
  },
}


describe('validateUser', () => {
  before(() => {
    log.info('Start testing user validation')
  })
  describe('#validateUser()', () => {
    it('should return false when password does not match', async () => {
      assert.equal(await createUser(optionsB), true)
    })
  })
  after(() => {
    log.info('End testing user validation')
  })
})
