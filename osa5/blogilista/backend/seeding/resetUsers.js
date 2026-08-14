const User = require('../models/user')
const bcrypt = require('bcrypt')
const { NODE_ENV } = process.env

const seedData = [
    { name: 'John Smith', username: 'admin', password: 'admin' },
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

async function resetUsers() {
    if (NODE_ENV !== 'test') {
        await User.deleteMany({})
        for (const user of seedData) {
            const passwordHash = await bcrypt.hash(user.password, 10)
            await new User({
                name: user.name,
                username: user.username,
                passwordHash: passwordHash
            }).save()
        }
    }
}

module.exports = resetUsers