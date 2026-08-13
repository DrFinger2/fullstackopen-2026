const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

function tokenExtractor(request, response, next) {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

async function userExtractor(request, response, next) {
    if (!request.token) {
        return response.status(401).json({ error: 'Token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' })
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(401).json({ error: 'User not found' })
    }

    request.user = user
    next()
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, request, response, next) {
    if (error.name === 'CastError'){
        return response.status(400).json({ error: 'Malformatted id.' })
    }
    else if (error.name === 'ValidationError'){
        const errors = Object.entries(error.errors).map(([field, err]) => ({  error: err.message }))
        return response.status(400).json({ error: errors[0] })
    }
    else if ( error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error' )){
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    else if (error.name === 'JsonWebTokenError'){
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    else if (error.name === 'TokenExpiredError'){
        return response.status(401).json({
            error: 'token expired'
        })
    }

    const errors = [{ field: null, message: 'Internal server error' }]
    logger.error(errors)
    return response.status(500).json({ errors: errors })
}

function unknownEndpoint(request, response) {
    const errors = [{ field: null, message: 'Unknown endpoint' }]
    return response.status(404).json({ errors: errors })
}

module.exports = {
    errorHandler: errorHandler,
    unknownEndpoint: unknownEndpoint,
    tokenExtractor: tokenExtractor,
    userExtractor: userExtractor
}

