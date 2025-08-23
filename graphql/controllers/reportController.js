const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

const mostBorrowedBooks = async (req, res) => {
    try {
        const result = await Borrow.aggregate([
            { $group: { _id: '$book', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
            { $unwind: '$book' },
            { $project: { _id: 0, book: 1, count: 1 } },
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const activeMembers = async (req, res) => {
    try {
        const result = await Borrow.aggregate([
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, user: { name: 1, email: 1 }, count: 1 } },
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const bookAvailability = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const borrowed = await Borrow.countDocuments({ returnDate: null });
        const availableCopies = await Book.aggregate([
            { $group: { _id: null, total: { $sum: '$copies' } } },
        ]);
        const available = availableCopies[0]?.total || 0;
        res.json({ totalBooks, borrowed, available });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { mostBorrowedBooks, activeMembers, bookAvailability };