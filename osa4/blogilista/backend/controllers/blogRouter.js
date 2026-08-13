const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


// 2. Router Definition
blogRouter.get('/', async (request, response) => {
    const included = { username: 1, name: 1 } // 1 or 0 = include or dont include this particular field
    const blogs = await Blog.find({}).populate('user', included )
    return response.json(blogs)
})


blogRouter.get('/:id', async (request, response) => {
    const blog =  await Blog.findById(request.params.id)
    if (blog) {
        return response.status(200).json(blog)
    }
    else {
        return response.status(404).json({ error: 'Resource not found' })
    }
})


blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const id = request.params.id

    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(404).end()
    }

    if (title !== undefined) blog.title = title
    if (author !== undefined) blog.author = author
    if (url !== undefined) blog.url = url
    if (likes !== undefined) blog.likes = likes

    const saved = await blog.save()
    return response.status(200).json(saved)
})


blogRouter.post('/', async (request, response) => {
    // 1. Check if token is valid
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }
    // 2. Check if userid is valid
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json({ error: 'User id is missing or is invalid' })
    }
    // 3. Create new blog and associate it with userid
    const blog = new Blog({
        title: request.body.title || '',
        author: request.body.author || '',
        url: request.body.url || '',
        likes: request.body.likes || 0,
        user: user._id
    })

    const saved = await blog.save()
    return response.status(201).json(saved)
})



module.exports = blogRouter