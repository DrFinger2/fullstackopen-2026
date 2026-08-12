
require('dns').setServers(['1.1.1.1', '8.8.8.8'])
const { test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const config = require('../utils/config')
const Blog = require('../models/blog')

// 1. Setup app and supertest
const app = require('../app')
const api = supertest(app)


// 2. Test data
const testData = [
    {
        title: 'HTML is easy',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/html-is-easy',
        likes: 5,
    },
    {
        title: 'Browser can execute only JavaScript',
        author: 'Matti Meikäläinen',
        url: 'https://example.com/browser-js',
        likes: 3,
    },
]

before(async () => {
    return await mongoose.connect(config.MONGODB_URI, { family: 4 })
})

// 3. Reset test data
beforeEach(async () => {
    await Blog.deleteMany({})
    testData.forEach(async (blog) => {
        const newBlog = new Blog(blog)
        await newBlog.save()
    })
})


// 4. Test - return all blogs
test('Blogs are returned as json.', async () => {
    return await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// 5. Test - if title contains specific keywords
test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)
    assert(titles.includes('HTML is easy'))
})

// 6. close connection
after(async () => {
    return await mongoose.connection.close()
})
