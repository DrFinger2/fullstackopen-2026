const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const messages = Object.freeze({
    invalid: 'invalid username or password',
    required:  'username and password are required'
})

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: messages.required })
    }

    const userInDatabase = await User.findOne({ username: username })
    if (!userInDatabase) {
        return response.status(401).json({ error: messages.invalid })
    }

    const isPasswordCorrect = await bcrypt.compare(password, userInDatabase.passwordHash)
    if (!isPasswordCorrect) {
        return response.status(401).json({ error: messages.invalid })
    }

    const tokenUser = {
        username: userInDatabase.username,
        id: userInDatabase._id
    }

    const oneHour = 60 * 60
    const token = jwt.sign(tokenUser, process.env.SECRET, { expiresIn: oneHour })

    return response
        .status(200)
        .send({ token: token, username: userInDatabase.username, name: userInDatabase.name })
})


module.exports = loginRouter