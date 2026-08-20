
require('dns').setServers(['1.1.1.1', '8.8.8.8'])
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogRouter = require('./controllers/blogRouter')
const loginRouter = require('./controllers/loginRouter')
const userRouter = require('./controllers/userRouter')
const resetRouter = require('./controllers/resetRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')

const { errorHandler, unknownEndpoint, tokenExtractor } = require('./utils/middleware')
const app = express()

async function connect () {
    try {
        logger.info('connecting to', config.MONGODB_URI)
        await mongoose.connect(config.MONGODB_URI, { family: 4 })
        logger.info('\nconnected to MongoDB')
        logger.info(`External url: ${config.EXTERNAL_URL}\n`)
    } catch (error) {
        logger.error('error connecting to MongoDB:', error.message)
        process.exit(1)
    }
}

async function configure() {
    try {
        if (process.env.NODE_ENV === 'prod') {
            app.use(express.static(path.join(__dirname, '../client/dist')))
            const response = await app.get('/*splat')
            response.sendFile(path.join(__dirname, '../client/dist/index.html'))
        }

        app.use(express.json())
        if (process.env.NODE_ENV !== 'test') {
            app.use(morgan('dev'))
        }

        app.use(tokenExtractor)
        app.use('/api/login', loginRouter)
        app.use('/api/users', userRouter)
        app.use('/api/blogs', blogRouter)

        if (process.env.NODE_ENV === 'test') {
            app.use('/api/testing', resetRouter)
        }
        app.use(unknownEndpoint)
        app.use(errorHandler)
    }
    catch (error) {
        logger.error('error configuring to server:', error.message)
        process.exit(1)
    }
}

async function start() {
    await configure()
    await connect()
}

start()

module.exports = app