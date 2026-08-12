const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
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
    const blog = new Blog(request.body)
    const saved = await blog.save()
    return response.status(201).json(saved)
})



module.exports = blogRouter