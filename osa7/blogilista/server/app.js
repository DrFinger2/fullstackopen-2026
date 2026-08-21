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

const {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
} = require('./utils/middleware')
const app = express()

async function connect() {
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

function configureBase() {
  app.use(express.json())
  app.use(tokenExtractor)
  app.use('/api/login', loginRouter)
  app.use('/api/users', userRouter)
  app.use('/api/blogs', blogRouter)
}

async function configure() {
  const filePath = path.join(__dirname, '../client/dist/index.html')
  const dirPath = path.join(__dirname, '../client/dist')
  const NODE_ENV = process.env.NODE_ENV

  try {
    if (NODE_ENV === 'test') {
      app.use('/api/testing', resetRouter)
      configureBase()
    } else if (NODE_ENV === 'dev') {
      app.use(morgan('dev'))
      configureBase()
    } else if (NODE_ENV === 'prod') {
      configureBase()
      app.use(express.static(dirPath))
      app.get('/*splat', (request, response) => {
        response.sendFile(filePath)
      })
    } else {
      throw new Error(`Invalid NODE_ENV: ${NODE_ENV}`)
    }

    app.use(unknownEndpoint)
    app.use(errorHandler)
  } catch (error) {
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
