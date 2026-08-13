const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
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


blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        response.status(404).end()
    }
    const requestId = request.user._id
    if (!blog.user || requestId !== blog.user.id){
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

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


blogRouter.post('/', userExtractor, async (request, response) => {
    const user = request.user
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