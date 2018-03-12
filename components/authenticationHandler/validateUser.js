const passwordEncryption = require('./passwordHashing')
const userSchema = require('./userSchema')


module.exports = async ({username, password, connection}) => {
  const User = await connection.model('usertables', userSchema)

  if (!username || !password) {
    return false
  }

  const promise = new Promise(resolve => {
    User.findOne({'username': username}, 'password salt', (error, data) => {
      if (error || !data) {
        resolve(false)
      }
      const result = data.password === passwordEncryption({
        password,
        salt: data.salt,
      })
      resolve(result)
    })
  })
  return await promise
}
