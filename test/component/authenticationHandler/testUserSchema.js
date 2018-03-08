const describe = require('mocha').describe
const before = require('mocha').before
const it = require('mocha').it
const after = require('mocha').after
const expect = require('chai').expect
const Schema = require('mongoose').Schema

const userSchema = require('../../../components/authenticationHandler/userSchema')

const compareUserSchema = new Schema({
  timestamp: { type: Number },
  username: { type: String },
  password: { type: String },
  salt: { type: String },
}, { _id: false, autoIndex: false })

const log = console

describe('userSchema', () => {
  before(() => {
    log.info('Start testing user schema')
  })
  it('should return valid user schema', (done) => {
    expect(userSchema).to.deep.equal(compareUserSchema)
    done()
  })
  after(() => {
    log.info('End testing user schema')
  })
})
