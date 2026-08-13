require('dotenv').config()

const { NODE_ENV, PORT, EXTERNAL_ADDRESS } = process.env

const MONGODB_URI = {
    test: process.env.MONGODB_URI_TEST,
    development: process.env.MONGODB_URI_DEVELOPMENT,
    production: process.env.MONGODB_URI_PRODUCTION
}[NODE_ENV] || process.env.MONGODB_URI_PRODUCTION

module.exports = {
    MONGODB_URI,
    PORT,
    EXTERNAL_ADDRESS
}