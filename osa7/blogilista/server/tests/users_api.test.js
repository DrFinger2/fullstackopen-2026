const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

const testData = [
  { name: 'Alice Smith', username: 'alice', password: 'password123' },
  { name: 'Bob Johnson', username: 'bob', password: 'password123' },
  { name: 'Charlie Williams', username: 'charlie', password: 'password123' },
  { name: 'David Brown', username: 'david', password: 'password123' },
  { name: 'Emma Jones', username: 'emma', password: 'password123' },
  { name: 'Frank Miller', username: 'frank', password: 'password123' },
  { name: 'Grace Davis', username: 'grace', password: 'password123' },
  { name: 'Hannah Wilson', username: 'hannah', password: 'password123' },
  { name: 'Ian Moore', username: 'ian', password: 'password123' },
  { name: 'Julia Taylor', username: 'julia', password: 'password123' },
  { name: 'Kevin Anderson', username: 'kevin', password: 'password123' },
  { name: 'Laura Thomas', username: 'laura', password: 'password123' },
  { name: 'Michael Jackson', username: 'michael', password: 'password123' },
  { name: 'Nina White', username: 'nina', password: 'password123' },
  { name: 'Oscar Harris', username: 'oscar', password: 'password123' },
  { name: 'Peter Martin', username: 'peter', password: 'password123' },
  { name: 'Rachel Thompson', username: 'rachel', password: 'password123' },
  { name: 'Sam Garcia', username: 'sam', password: 'password123' },
]


describe('POST /api/users', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (const user of testData) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      await new User({
        name: user.name,
        username: user.username,
        passwordHash: passwordHash,
      }).save()
    }
  })

  test('Creation succeeds with fresh username', async () => {
    const user = { name: 'test', username: 'Matti', password: 'Meikäläinen' }

    const createdUser = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(createdUser.body.username, user.username)
  })

  test('fails username is too short', async () => {
    const user = { name: 'Test', username: 'ab', password: 'password123' }

    const result = await api.post('/api/users').send(user).expect(400)
    assert.ok(result.body.error)
  })

  test('fails if password is too short', async () => {
    const user = { name: 'Test', username: 'newuser', password: 'short' }

    const result = await api.post('/api/users').send(user).expect(400)
    assert.ok(result.body.error)
  })

  test('fails if username is already taken', async () => {
    const user = { name: 'Test', username: 'alice', password: 'password123' }

    const result = await api.post('/api/users').send(user).expect(400)
    assert.ok(result.body.error)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
