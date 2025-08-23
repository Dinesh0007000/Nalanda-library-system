const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

const borrowBook = async (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID required' });
    try {
        const book = await Book.findById(bookId);
        if (!book || book.copies <= 0) return res.status(400).json({ message: 'Book unavailable' });
        const borrow = new Borrow({ user: req.user._id, book: bookId });
        await borrow.save();
        book.copies -= 1;
        await book.save();
        res.status(201).json(borrow);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const returnBook = async (req, res) => {
    try {
        const borrow = await Borrow.findOne({ _id: req.params.id, user: req.user._id, returnDate: null });
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found or already returned' });
        borrow.returnDate = Date.now();
        await borrow.save();
        const book = await Book.findById(borrow.book);
        book.copies += 1;
        await book.save();
        res.json(borrow);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const borrowHistory = async (req, res) => {
    try {
        const history = await Borrow.find({ user: req.user._id }).populate('book', 'title author');
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { borrowBook, returnBook, borrowHistory };