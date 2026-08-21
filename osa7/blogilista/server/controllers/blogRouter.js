const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
const formatUrl = require('../utils/format_url')
const isBlank = (field) =>
  !field || typeof field !== 'string' || field.trim() === ''

blogRouter.get('/', async (request, response) => {
  const included = { username: 1, name: 1 } // 1 or 0 = include or dont include this particular field
  const blogs = await Blog.find({}).populate('user', included)
  return response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const included = { username: 1, name: 1 }
  const blog = await Blog.findById(request.params.id).populate('user', included)
  if (blog) {
    return response.status(200).json(blog)
  } else {
    return response.status(404).json({ error: 'Resource not found' })
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  const requestId = request.user._id.toString()
  if (!blog.user || requestId !== blog.user.toString()) {
    return response
      .status(403)
      .json({ error: 'Only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

// Terrible solution but part of the requirements is to use this specific method to update the likes!
blogRouter.put('/:id', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const id = request.params.id

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).end()
  }

  // I hate this but part of the requirements, haha!
  const isOwner =
    blog.user && request.user._id.toString() === blog.user.toString()
  if (title !== undefined && title !== blog.title && !isOwner) {
    return response
      .status(403)
      .json({ error: 'Only the creator can edit this blog' })
  }
  if (author !== undefined && author !== blog.author && !isOwner) {
    return response
      .status(403)
      .json({ error: 'Only the creator can edit this blog' })
  }
  if (url !== undefined && url !== blog.url && !isOwner) {
    return response
      .status(403)
      .json({ error: 'Only the creator can edit this blog' })
  }

  if (title !== undefined) {
    blog.title = title
  }
  if (author !== undefined) {
    blog.author = author
  }
  if (url !== undefined) {
    blog.url = url
  }
  if (likes !== undefined) {
    blog.likes = likes
  }

  const saved = await blog.save()
  const populated = await saved.populate('user', { username: 1, name: 1 })
  return response.status(200).json(populated)
})

// I build this but not going to use it because that would be too easy
blogRouter.post('/:id/like', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes += 1
  const saved = await blog.save()
  const populated = await saved.populate('user', { username: 1, name: 1 })
  return response.status(200).json(populated)
})

blogRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const { comment } = request.body
  const id = request.params.id

  if (isBlank(comment)) {
    return response.status(400).json({ error: 'Comment cannot be blank' })
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.comments = blog.comments.concat(comment)

  const saved = await blog.save()
  const populated = await saved.populate('user', { username: 1, name: 1 })
  return response.status(201).json(populated)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const { title, author, url, likes } = request.body
  if (isBlank(title)) {
    return response.status(400).json({ error: 'Title cannot be blank' })
  }
  if (isBlank(author)) {
    return response.status(400).json({ error: 'Author cannot be blank' })
  }
  if (isBlank(url)) {
    return response.status(400).json({ error: 'URL cannot be blank' })
  }

  const URL = formatUrl(url)
  if (!URL.isValid) {
    return response.status(400).json({ error: 'URL is not in a valid format' })
  }

  const blog = new Blog({
    title: title || '',
    author: author || '',
    url: URL.formattedUrl || '',
    likes: likes || 0,
    user: user._id,
  })

  const saved = await blog.save()
  user.blogs = user.blogs.concat(saved._id)
  await user.save()

  const populated = await saved.populate('user', { username: 1, name: 1 })
  return response.status(201).json(populated)
})

module.exports = blogRouter
