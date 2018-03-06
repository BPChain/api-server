const passwordEncryption = require('./passwordHashing')
const userSchema = require('./userSchema')


module.exports = async (options = {}) => {
  const {
    username,
    password,
    connection,
  } = options

  const User = await connection.model('usertable', userSchema)


  if (!username || !password) {
    return false
  }

  return await User.findOne({ 'username': username }, 'password salt', (error, data ) => {
    if (error) return false
    return data.password === passwordEncryption({
      password,
      salt: data.salt,
    })
  })
}
