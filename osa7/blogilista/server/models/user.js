const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,

  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
    delete obj.passwordHash
  },
})

const User = mongoose.model('User', userSchema)
module.exports = User
