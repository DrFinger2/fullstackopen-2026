// eslint-disable-next-line no-unused-vars
function errorHandler(error, request, response, next) {
    console.error(error)
    return response.status(500).json({ errors: [{ field: null, message: 'Internal server error' }] })
}

module.exports = {
    errorHandler: errorHandler
}

