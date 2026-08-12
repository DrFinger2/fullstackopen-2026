require('dns').setServers(['1.1.1.1', '8.8.8.8'])
const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

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

describe('Blog API', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        for (const blog of testData) {
            const newBlog = new Blog(blog)
            await newBlog.save()
        }
    })

    describe('GET /api/blogs', () => {
        test('returns blogs as json with correct status', async () => {
            // task 4.8
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('returns the correct number of blogs', async () => {
            // task 4.8
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, testData.length)
        })

        test('identifies blogs by id instead of _id', async () => {
            // task 4.9
            const response = await api.get('/api/blogs')
            for (const blog of response.body) {
                assert.notEqual(blog.id, undefined)
                assert.strictEqual(blog._id, undefined)
            }
        })
    })

    describe('POST /api/blogs', () => {
        test('creates a new blog', async () => {
            // task 4.10
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                url: 'https://example.com/',
                likes: 0,
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.notEqual(response.body.id, undefined)

            const blogsAtEnd = await api.get('/api/blogs')
            assert.strictEqual(blogsAtEnd.body.length, testData.length + 1)

            const titles = blogsAtEnd.body.map(blog => blog.title)
            assert.ok(titles.includes(newBlog.title))
        })

        test('defaults likes to 0 when missing', async () => {
            // task 4.11
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                url: 'https://example.com/',
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)

            assert.strictEqual(response.body.likes, 0)
        })

        test('fails with 400 when title is missing', async () => {
            // task 4.12
            const newBlog = {
                author: 'Example Name',
                url: 'https://example.com/',
                likes: 0,
            }

            await api.post('/api/blogs').send(newBlog).expect(400)
        })

        test('fails with 400 when url is missing', async () => {
            // task 4.12
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                likes: 0,
            }

            await api.post('/api/blogs').send(newBlog).expect(400)
        })
    })

    describe('DELETE /api/blogs/:id', () => {
        test('removes blog with a valid id', async () => {
            // task 4.13
            const blogsAtStart = await api.get('/api/blogs')
            const blogToDelete = blogsAtStart.body.at(-1)

            await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

            const blogsAtEnd = await api.get('/api/blogs')
            assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

            const ids = blogsAtEnd.body.map(blog => blog.id)
            assert.ok(!ids.includes(blogToDelete.id))
        })
    })

    describe('PUT /api/blogs/:id', () => {
        test('updates existing blog', async () => {
            // task 4.14
            const blogsAtStart = await api.get('/api/blogs')
            const blogToUpdate = blogsAtStart.body.at(-1)
            blogToUpdate.title = 'UPDATED TITLE'

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, blogToUpdate.title)
            assert.strictEqual(response.body.id, blogToUpdate.id)
        })
    })
})

after(async () => {
    await Blog.deleteMany({})
    for (const blog of testData) {
        const newBlog = new Blog(blog)
        await newBlog.save()
    }
    await mongoose.connection.close()
})