const express = require('express');
const { mostBorrowedBooks, activeMembers, bookAvailability } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/most-borrowed', protect, admin, mostBorrowedBooks);
router.get('/active-members', protect, admin, activeMembers);
router.get('/availability', protect, admin, bookAvailability);

module.exports = router;