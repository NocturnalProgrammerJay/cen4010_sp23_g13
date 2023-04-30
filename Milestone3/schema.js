const mongoose = require("mongoose")

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  published: {
    type: String,
  },
  isbn: {
    type: String,
  },
  img: {
    type: String,
  },
})


const schema = mongoose.model("books", booksSchema)

module.exports = schema