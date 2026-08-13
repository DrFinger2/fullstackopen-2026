const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { validateUsername, validatePassword } = require('../utils/validation')

userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    return response.status(200).json(users)
})
userRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    const nameResult = validateUsername(username)
    if (!nameResult.ok) {
        return response.status(400).json({ error: nameResult.error })
    }

    const passwordResult = validatePassword(password)
    if (!passwordResult.ok) {
        return response.status(400).json({ error: passwordResult.error })
    }

    const existingUser = await User.findOne({ username: username })
    if (existingUser) {
        return response.status(400).json({ error: 'Username is already taken' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name: name,
        username: username,
        passwordHash: passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter