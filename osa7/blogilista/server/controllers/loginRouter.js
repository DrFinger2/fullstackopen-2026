const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'Username and password are required' })
  }

  const userInDatabase = await User.findOne({ username: username })
  if (!userInDatabase) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userInDatabase.passwordHash
  )
  if (!isPasswordCorrect) {
    return response.status(401).json({ error: 'Invalid username or password' })
  }

  const tokenUser = {
    username: userInDatabase.username,
    id: userInDatabase._id,
  }

  const token = jwt.sign(tokenUser, process.env.SECRET, {
    expiresIn: 60 * 60 /*an hour*/,
  })

  return response
    .status(200)
    .send({
      token: token,
      username: userInDatabase.username,
      name: userInDatabase.name,
    })
})

module.exports = loginRouter
