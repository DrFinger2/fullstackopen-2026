const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 3,
        maxLength: 50
    },
    number: {
        type: String,
        minLength: 2,
        maxLength: 50
    },
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