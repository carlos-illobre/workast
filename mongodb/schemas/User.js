const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    avatar: String,
})

module.exports = userSchema
