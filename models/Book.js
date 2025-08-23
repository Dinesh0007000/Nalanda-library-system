const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    publicationDate: { type: Date },
    genre: { type: String },
    copies: { type: Number, default: 1, min: 0 },
});

module.exports = mongoose.model('Book', bookSchema);