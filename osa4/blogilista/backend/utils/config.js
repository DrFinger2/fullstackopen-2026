require('dotenv').config()

const EXTERNAL_ADDRESS = process.env.EXTERNAL_ADDRESS
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    MONGODB_URI: MONGODB_URI,
    PORT: PORT,
    EXTERNAL_ADDRESS: EXTERNAL_ADDRESS
}