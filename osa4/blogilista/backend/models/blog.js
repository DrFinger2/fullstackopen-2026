const mongoose = require('mongoose')


const blogSchema = mongoose.Schema({
    title: {
        type: String,
        minLength: 2,
        required: true
    },
    author: {
        type: String,
        maxLength: 50,
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
})

blogSchema.set('toJSON', {
    transform : (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        return obj
    }
})

module.exports = mongoose.model('Blog', blogSchema)
