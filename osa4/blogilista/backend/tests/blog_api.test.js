require('dns').setServers(['1.1.1.1', '8.8.8.8'])
const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)


const initialBlogs = [
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

const defaultUser = {
    name: 'Test User',
    username: 'testuser',
    password: 'password123'
}
const alternateUser = {
    name: 'Other User',
    username: 'otheruser',
    password: 'password123'
}


async function getBlogsInDb() {
    const response = await api.get('/api/blogs')
    return response.body
}

async function registerAndLogin(credentials) {
    await api.post('/api/users').send(credentials)
    const response = await api.post('/api/login').send({
        username: credentials.username,
        password: credentials.password,
    })
    return `Bearer ${response.body.token}`
}

function createBlog(blog, token = '') {
    const request = api.post('/api/blogs').send(blog)
    if (token) {
        request.set('Authorization', token)
    }
    return request
}

describe('Blog API', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })

    describe('GET /api/blogs', () => {
        test('returns blogs as json', async () => {
            // task 4.8
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('returns all blogs', async () => {
            // task 4.8
            const blogs = await getBlogsInDb()
            assert.strictEqual(blogs.length, initialBlogs.length)
        })

        test('uses id instead of _id', async () => {
            // task 4.9
            const blogs = await getBlogsInDb()

            for (const blog of blogs) {
                assert.notEqual(blog.id, undefined)
                assert.strictEqual(blog._id, undefined)
            }
        })
    })

    describe('POST /api/blogs', () => {
        test('creates a valid blog', async () => {
            // task 4.10
            const token = await registerAndLogin(defaultUser)
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                url: 'https://example.com/',
                likes: 0,
            }

            const response = await createBlog(newBlog, token)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.notEqual(response.body.id, undefined)
            const blogsAtEnd = await getBlogsInDb()
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
            const titles = blogsAtEnd.map(blog => blog.title)
            assert.ok(titles.includes(newBlog.title))
        })

        test('defaults missing likes to 0', async () => {
            // task 4.11
            const token = await registerAndLogin(defaultUser)
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                url: 'https://example.com/',
            }

            const response = await createBlog(newBlog, token)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('fails if title is missing', async () => {
            // task 4.12
            const token = await registerAndLogin(defaultUser)
            const newBlog = {
                author: 'Example Name',
                url: 'https://example.com/',
                likes: 0,
            }

            await createBlog(newBlog, token).expect(400)
        })

        test('fails if url is missing', async () => {
            // task 4.12
            const token = await registerAndLogin(defaultUser)
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                likes: 0,
            }

            await createBlog(newBlog, token).expect(400)
        })

        test('fails without token', async () => {
            // task 4.23
            const newBlog = {
                title: 'Blog without token',
                author: 'Example Name',
                url: 'https://example.com/no-token',
                likes: 0,
            }

            await createBlog(newBlog).expect(401)
        })
    })

    describe('DELETE /api/blogs/:id', () => {
        test('deletes owned blog', async () => {
            // task 4.13 / 4.21
            const token = await registerAndLogin(defaultUser)
            const newBlog = {
                title: 'Blog to be deleted',
                author: 'Example Name',
                url: 'https://example.com/delete-me',
                likes: 0,
            }

            const createdResponse = await createBlog(newBlog, token).expect(201)
            const blogsAtStart = await getBlogsInDb()

            await api
                .delete(`/api/blogs/${createdResponse.body.id}`)
                .set('Authorization', token)
                .expect(204)

            const blogsAtEnd = await getBlogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

            const ids = blogsAtEnd.map(blog => blog.id)
            assert.ok(!ids.includes(createdResponse.body.id))
        })

        test('fails without token', async () => {
            // task 4.21
            const blogsInDb = await getBlogsInDb()
            const blogToDelete = blogsInDb[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401)
        })

        test('fails if not owner', async () => {
            // task 4.21
            const ownerToken = await registerAndLogin(defaultUser)
            const newBlog = {
                title: 'Owned by Test user',
                author: 'Example Name',
                url: 'https://example.com/owned',
                likes: 0,
            }

            const createdResponse = await createBlog(newBlog, ownerToken).expect(201)
            const otherToken = await registerAndLogin(alternateUser)

            await api
                .delete(`/api/blogs/${createdResponse.body.id}`)
                .set('Authorization', otherToken)
                .expect(403)
        })
    })

    describe('PUT /api/blogs/:id', () => {
        test('updates existing blog', async () => {
            // task 4.14
            const blogsAtStart = await getBlogsInDb()
            const blogToUpdate = blogsAtStart[0]
            const updatedBlogData = { ...blogToUpdate, title: 'UPDATED TITLE' }

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlogData)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, updatedBlogData.title)
            assert.strictEqual(response.body.id, blogToUpdate.id)
        })
    })
})

after(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
    await mongoose.connection.close()
})