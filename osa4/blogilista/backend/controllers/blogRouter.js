const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response, next) => {
    Blog.find({})
        .then((blogs) => {
            return response.json(blogs)
        })
        .catch(error => next(error))
})

blogRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then((blog) => {
            if (blog) {
                return response.status(200).json(blog)
            }
            else {
                return response.status(404).json({ error: 'Resource not found' })
            }
        })
        .catch(error => next(error))
})

blogRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
    blog.save()
        .then((result) => {
            return response.status(201).json(result)
        })
        .catch(error => next(error))
})



module.exports = blogRouter