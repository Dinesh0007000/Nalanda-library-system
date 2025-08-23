const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const { generateToken } = require('../middleware/auth');
const validator = require('validator');

// Reuse aggregation logic
const mostBorrowedBooksAgg = () => Borrow.aggregate([
    { $group: { _id: '$book', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
    { $unwind: '$book' },
    { $project: { book: 1, count: 1 } },
]);

const activeMembersAgg = () => Borrow.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $match: { 'user.role': 'Member' } }, // Added to filter out Admins
    { $project: { user: 1, count: 1 } },
]);

const bookAvailabilityAgg = async () => {
    const totalBooks = await Book.countDocuments();
    const borrowed = await Borrow.countDocuments({ returnDate: null });
    const availableCopies = await Book.aggregate([{ $group: { _id: null, total: { $sum: '$copies' } } }]);
    return { totalBooks, borrowed, available: availableCopies[0]?.total || 0 };
};

const resolvers = {
    Query: {
        listBooks: async (_, args, { user }) => {
            if (!user) throw new AuthenticationError('Authentication required');
            const { page = 1, limit = 10, genre, author } = args;
            const query = {};
            if (genre) query.genre = genre;
            if (author) query.author = author;
            return Book.find(query).limit(limit).skip((page - 1) * limit);
        },
        borrowHistory: async (_, __, { user }) => {
            if (!user) throw new AuthenticationError('Authentication required');
            return Borrow.find({ user: user._id }).populate('book').populate('user');
        },
        mostBorrowedBooks: async (_, __, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            return mostBorrowedBooksAgg();
        },
        activeMembers: async (_, __, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            return activeMembersAgg();
        },
        bookAvailability: async (_, __, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            return bookAvailabilityAgg();
        },
    },
    Mutation: {
        register: async (_, args) => {
            const { name, email, password, role } = args;
            if (!name || !email || !password || !validator.isEmail(email)) {
                throw new Error('Invalid input data');
            }
            const existingAdmin = await User.findOne({ role: 'Admin' });
            if (role === 'Admin' && existingAdmin) {
                throw new Error('Only one Admin is allowed');
            }
            let user = await User.findOne({ email });
            if (user) throw new Error('User already exists');
            user = new User({ name, email, password, role: role || 'Member' });
            await user.save();
            return generateToken(user);
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.matchPassword(password))) {
                throw new AuthenticationError('Invalid credentials');
            }
            return generateToken(user);
        },
        addBook: async (_, args, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            const { title, author, isbn, publicationDate, genre, copies } = args;
            if (!title || !author || !isbn) throw new Error('Missing required fields');
            const book = new Book({ title, author, isbn, publicationDate, genre, copies });
            await book.save();
            return book;
        },
        updateBook: async (_, args, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            const book = await Book.findByIdAndUpdate(args.id, args, { new: true, runValidators: true });
            if (!book) throw new Error('Book not found');
            return book;
        },
        deleteBook: async (_, { id }, { user }) => {
            if (!user || user.role !== 'Admin') throw new ForbiddenError('Admin required');
            const book = await Book.findByIdAndDelete(id);
            if (!book) throw new Error('Book not found');
            return 'Book deleted';
        },
        borrowBook: async (_, { bookId }, { user }) => {
            if (!user) throw new AuthenticationError('Authentication required');
            const book = await Book.findById(bookId);
            if (!book || book.copies <= 0) throw new Error('Book unavailable');
            const borrow = new Borrow({ user: user._id, book: bookId });
            await borrow.save();
            book.copies -= 1;
            await book.save();
            return borrow;
        },
        returnBook: async (_, { id }, { user }) => {
            if (!user) throw new AuthenticationError('Authentication required');
            const borrow = await Borrow.findOne({ _id: id, user: user._id, returnDate: null });
            if (!borrow) throw new Error('Borrow record not found or already returned');
            borrow.returnDate = Date.now();
            await borrow.save();
            const book = await Book.findById(borrow.book);
            book.copies += 1;
            await book.save();
            return borrow;
        },
    },
};

module.exports = resolvers;