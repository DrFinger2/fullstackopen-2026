const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const app = require('../app')
const api = supertest(app)


describe('Login API', async () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('Password', 10)
        const user = User({
            username: 'Admin',
            name: 'John Smith',
            passwordHash: passwordHash
        })
        await user.save()
    })

    describe('POST /api/login', async () => {
        test('Able to login as admin', async () => {
            const user = { username: 'Admin', password: 'Password' }

            const loggedInUser = await api.post('/api/login')
                .send(user)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(loggedInUser.body.username, user.username)
        })

        test('Unable to login with invalid password', async () => {
            const user = {
                username: 'Admin',
                password: '123'
            }
            return await api.post('/api/login')
                .send(user)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })

        test('Unable to login with invalid username', async () => {
            const user = {
                username: '123',
                password: 'Password'
            }
            return await api.post('/api/login')
                .send(user)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})