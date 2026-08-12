
require('dns').setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')

const { errorHandler, unknownEndpoint } = require('./utils/middleware')
const app = express()

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('\nconnected to MongoDB')
        logger.info(`External address: ${config.EXTERNAL_ADDRESS}\n`)
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
        process.exit(1)
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/blogs', blogRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app