const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  text: String,
  tags: [String],
})

module.exports = articleSchema
