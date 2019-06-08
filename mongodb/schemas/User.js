const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  avatar: String,
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  }],
})

userSchema.methods.sayHello = function () {
  return `Hello, I'm ${this.name}`
}

module.exports = userSchema
