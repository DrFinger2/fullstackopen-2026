const Blog = require('../models/blog')
const User = require('../models/user')
const { NODE_ENV } = process.env

const seedData = [
    {
        title: 'Learning Express with Node.js',
        author: 'Alex Morgan',
        url: 'https://example.com/learning-express',
        likes: 12,
        user: 'admin'
    },
    {
        title: 'Getting Started with MongoDB',
        author: 'Sarah Johnson',
        url: 'https://example.com/getting-started-mongodb',
        likes: 8,
        user: 'alice'
    },
    {
        title: 'Understanding REST APIs',
        author: 'Michael Brown',
        url: 'https://example.com/understanding-rest-apis',
        likes: 25,
        user: 'alice'
    },
    {
        title: 'JavaScript Tips for Beginners',
        author: 'Emma Wilson',
        url: 'https://example.com/javascript-tips',
        likes: 5,
        user: 'bob'
    },
    {
        title: 'Building Better Node Applications',
        author: 'Daniel Smith',
        url: 'https://example.com/better-node-applications',
        likes: 18,
        user: 'bob'
    }
]

async function resetBlogs() {
    if (NODE_ENV === 'test') {
        return
    }

    await Blog.deleteMany({})
    for (const seedBlog of seedData) {
        const user = await User.findOne({ username: seedBlog.user })
        if (!user) continue

        const blog = new Blog({
            title: seedBlog.title,
            author: seedBlog.author,
            url: seedBlog.url,
            likes: seedBlog.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
    }
}

module.exports = resetBlogs