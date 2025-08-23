const Book = require('../models/Book');

const addBook = async (req, res) => {
    const { title, author, isbn, publicationDate, genre, copies } = req.body;
    if (!title || !author || !isbn) return res.status(400).json({ message: 'Missing required fields' });
    try {
        const book = new Book({ title, author, isbn, publicationDate, genre, copies });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const listBooks = async (req, res) => {
    const { page = 1, limit = 10, genre, author } = req.query;
    const query = {};
    if (genre) query.genre = genre;
    if (author) query.author = author;
    try {
        const books = await Book.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const count = await Book.countDocuments(query);
        res.json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addBook, updateBook, deleteBook, listBooks };