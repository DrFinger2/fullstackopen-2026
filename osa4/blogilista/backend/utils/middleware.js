const logger = require('./logger')

// eslint-disable-next-line no-unused-vars
function errorHandler(error, request, response, next) {
    if (error.name === 'CastError') {
        const errors = [{ field: 'id', message: 'Malformatted id.' }]
        logger.info(errors)
        return response.status(400).json({ errors: errors })
    }
    else if (error.name === 'ValidationError') {
        const errors = Object.entries(error.errors).map(([field, err]) => ({ field: field, message: err.message }))
        logger.info(errors)
        return response.status(400).json({ errors: errors })
    }
    else {
        const errors = [{ field: null, message: 'Internal server error' }]
        logger.error(errors)
        return response.status(500).json({ errors: errors })
    }
}

function unknownEndpoint(request, response) {
    const errors = [{ field: null, message: 'Unknown endpoint' }]
    return response.status(404).json({ errors: errors })
}

module.exports = {
    errorHandler: errorHandler,
    unknownEndpoint: unknownEndpoint
}

