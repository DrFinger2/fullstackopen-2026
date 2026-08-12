
require('dns').setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')

const { errorHandler, unknownEndpoint } = require('./utils/middleware')
const app = express()

const connectToDatabase = async () => {
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

connectToDatabase()

app.use(express.static('dist'))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
}

app.use('/api/blogs', blogRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app