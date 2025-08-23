const express = require('express');
const { addBook, updateBook, deleteBook, listBooks } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, admin, addBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);
router.get('/', protect, listBooks);

module.exports = router;