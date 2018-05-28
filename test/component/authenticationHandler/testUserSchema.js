const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Schema = require('mongoose').Schema
const userHandler = require('../../../components/authenticationHandler/userHandler')
const userSchema = userHandler.userSchema

const compareUserSchema = new Schema({
  timestamp: {type: Number},
  username: {type: String},
  password: {type: String},
  salt: {type: String},
}, {_id: false, autoIndex: false})

describe('userSchema', () => {
  it('should return valid user schema', (done) => {
    expect(userSchema).to.deep.equal(compareUserSchema)
    done()
  })
})
