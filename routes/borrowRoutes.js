const express = require('express');
const { borrowBook, returnBook, borrowHistory } = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, borrowBook);
router.put('/:id/return', protect, returnBook);
router.get('/history', protect, borrowHistory);

module.exports = router;