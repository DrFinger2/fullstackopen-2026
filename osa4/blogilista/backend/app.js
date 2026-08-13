
require('dns').setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogRouter = require('./controllers/blogRouter')
const loginRouter = require('./controllers/loginRouter')
const userRouter = require('./controllers/userRouter')

const config = require('./utils/config')
const logger = require('./utils/logger')
const resetUsers = require('./seeding/resetUsers')
const resetBlogs = require('./seeding/resetBlogs')

const { errorHandler, unknownEndpoint, tokenExtractor } = require('./utils/middleware')
const app = express()

async function connectToDatabase () {
    try {
        logger.info('connecting to', config.MONGODB_URI)
        await mongoose.connect(config.MONGODB_URI, { family: 4 })
        logger.info('\nconnected to MongoDB')
        logger.info(`External address: ${config.EXTERNAL_ADDRESS}\n`)
    } catch (error) {
        logger.error('error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}

function configure () {
    app.use(express.static('dist'))
    app.use(express.json())
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'))
    }
    app.use(tokenExtractor)
    app.use('/api/login', loginRouter)
    app.use('/api/users', userRouter)
    app.use('/api/blogs', blogRouter)
    app.use(unknownEndpoint)
    app.use(errorHandler)
}

async function start () {
    await connectToDatabase()
    await resetUsers()
    await resetBlogs()
}

configure()
start()

module.exports = app