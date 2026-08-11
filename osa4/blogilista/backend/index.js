require('dns').setServers(['1.1.1.1', '8.8.8.8'])

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogRouter')
const config = require('./utils/config')

function main() {
    const url = config.MONGODB_URI
    const address = config.EXTERNAL_ADDRESS
    const port = config.PORT

    mongoose.connect(url, { family: 4 })
        .then(() => {
            const app = express()

            app.use(express.json())
            app.use(morgan('dev'))
            app.use('/api/blog', blogRouter)

            const server = app.listen(port, () => {
                console.log(`Server running on port ${port}`)
                console.log(`Server address: ${address}`)
            })

            process.on('SIGINT', () => {
                console.log('Shutting down...')
                server.close(() => {
                    console.log('MongoDB connection closed')
                    process.exit(0)
                })
            })
        })
        .catch((error) => {
            console.error(error)
        })
}

main()