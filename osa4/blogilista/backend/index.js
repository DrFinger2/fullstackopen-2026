require('dns').setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogRouter = require('./controllers/blogRouter')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { errorHandler } = require('./utils/middleware')


function main() {
    const url = config.MONGODB_URI
    const address = config.EXTERNAL_ADDRESS
    const port = config.PORT

    mongoose.connect(url, { family: 4 }).then(() => {
        const app = express()

        app.use(express.json())
        app.use(morgan('dev'))
        app.use('/api/blog', blogRouter)
        app.use(errorHandler)

        const server = app.listen(port, () => {
            logger.info(`Server running on port ${port}`)
            logger.info(`Server address: ${address}`)
        })

        process.on('SIGINT', () => {
            logger.info('Shutting down...')
            server.close(() => {
                mongoose.connection.close().then(() => {
                    logger.info('MongoDB connection closed')
                    logger.info(0)
                })
            })
        })
    })
        .catch((error) => {
            logger.error(error)
        })
}

main()