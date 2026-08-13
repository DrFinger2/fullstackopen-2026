const Blog = require('../models/blog')
const { NODE_ENV } = process.env

const seedData = [
    {
        title: 'Learning Express with Node.js',
        author: 'Alex Morgan',
        url: 'https://example.com/learning-express',
        likes: 12
    },
    {
        title: 'Getting Started with MongoDB',
        author: 'Sarah Johnson',
        url: 'https://example.com/getting-started-mongodb',
        likes: 8
    },
    {
        title: 'Understanding REST APIs',
        author: 'Michael Brown',
        url: 'https://example.com/understanding-rest-apis',
        likes: 25
    },
    {
        title: 'JavaScript Tips for Beginners',
        author: 'Emma Wilson',
        url: 'https://example.com/javascript-tips',
        likes: 5
    },
    {
        title: 'Building Better Node Applications',
        author: 'Daniel Smith',
        url: 'https://example.com/better-node-applications',
        likes: 18
    }
]

async function resetBlogs() {
    if (NODE_ENV !== 'test') {
        await Blog.deleteMany({})
        await Blog.insertMany(seedData)
    }
}

module.exports = resetBlogs