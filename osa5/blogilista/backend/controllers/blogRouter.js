const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

const isBlank = (field) => (!field || typeof field !== 'string' || field.trim() === '')

blogRouter.get('/', async (request, response) => {
    const included = { username: 1, name: 1 } // 1 or 0 = include or dont include this particular field
    const blogs = await Blog.find({}).populate('user', included )
    return response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const included = { username: 1, name: 1 }
    const blog = await Blog.findById(request.params.id).populate('user', included)
    if (blog) {
        return response.status(200).json(blog)
    }
    else {
        return response.status(404).json({ error: 'Resource not found' })
    }
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }
    const requestId = request.user._id.toString()
    if (!blog.user || requestId !== blog.user.toString()){
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
})


blogRouter.put('/:id', userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body
    const id = request.params.id

    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(404).end()
    }

    const requestId = request.user._id.toString()
    if (!blog.user || requestId !== blog.user.toString()) {
        return response.status(403).json({ error: 'only the creator can edit this blog' })
    }

    if (title !== undefined) blog.title = title
    if (author !== undefined) blog.author = author
    if (url !== undefined) blog.url = url
    if (likes !== undefined) blog.likes = likes

    const saved = await blog.save()
    return response.status(200).json(saved)
})


blogRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user
    const { title, author, url, likes } = request.body

    if (!isBlank(title)) {
        return response.status(400).json({ error: 'Title cannot be blank' })
    }
    if (!isBlank(author)) {
        return response.status(400).json({ error: 'Author cannot be blank' })
    }
    if (!isBlank(url)) {
        return response.status(400).json({ error: 'URL cannot be blank' })
    }

    const blog = new Blog({
        title: title || '',
        author: author || '',
        url: url || '',
        likes: likes || 0,
        user: user._id
    })

    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    return response.status(201).json(saved)
})


module.exports = blogRouter