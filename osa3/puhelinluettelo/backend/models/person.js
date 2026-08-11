const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        return obj
    }
})

const PersonModel = mongoose.model('Person', personSchema)

module.exports = {
    Person: PersonModel,
    connect: (url) => {
        return mongoose.connect(url, { family: 4 })
    },
    disconnect: () => {
        return mongoose.connection.close()
    }
}