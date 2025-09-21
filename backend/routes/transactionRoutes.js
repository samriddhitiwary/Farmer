const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Add transaction
router.post('/', transactionController.addTransaction);

// Get transactions by user
router.get('/user/:userId', transactionController.getUserTransactions);

module.exports = router;
