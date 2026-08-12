require('dns').setServers(['1.1.1.1', '8.8.8.8'])
const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const app = require('../app')
const api = supertest(app)

// Test data
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


describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        for (const blog of testData) {
            const newBlog = new Blog(blog)
            await newBlog.save()
        }
    })

    // 4.8: blogilistan testit, step 1
    test('4.8: GET /api/blogs returns the correct number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, testData.length)
    })

    // 4.9: blogilistan testit, step 2
    test('4.9: blogs have an id field instead of _id', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        for (const blog of response.body) {
            assert.notEqual(blog.id, undefined)
            assert.strictEqual(blog._id, undefined)
        }
    })

    describe('4.10: addition of a new blog', () => {
        test('a valid blog can be added', async () => {
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
    })

    // 4.11: blogilistan testit, step 4
    test('4.11: if likes is missing, it defaults to 0', async () => {
        const newBlog = {
            title: 'Example blog',
            author: 'Example Name',
            url: 'https://example.com/',
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)
    })

    // 4.12: blogilistan testit, step 5
    describe('4.12: a blog without title or url cannot be added', () => {
        test('fails with status 400 if title is missing', async () => {
            const newBlog = {
                author: 'Example Name',
                url: 'https://example.com/',
                likes: 0,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })

        test('fails with status 400 if url is missing', async () => {
            const newBlog = {
                title: 'Example blog',
                author: 'Example Name',
                likes: 0,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })
    })

    // 4.13: blogilistan laajennus, step 1
    describe('4.13: deletion of a blog', () => {
        test('succeeds with status 204 if id is valid', async () => {
            const blogsAtStart = await api.get('/api/blogs')
            const blogToDelete = blogsAtStart.body.at(-1)

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await api.get('/api/blogs')
            assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

            const ids = blogsAtEnd.body.map(blog => blog.id)
            assert.ok(!ids.includes(blogToDelete.id))
        })
    })

    // 4.14: blogilistan laajennus, step 2
    describe('4.14: updating a blog', () => {
        test('succeeds in updating the likes of an existing blog', async () => {
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