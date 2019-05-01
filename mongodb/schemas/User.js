const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    avatar: String,
})

userSchema.methods.sayHello = function () {
    return `Hello, I'm ${this.name}`
}

module.exports = userSchema
