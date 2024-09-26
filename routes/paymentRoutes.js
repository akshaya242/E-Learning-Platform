const express = require('express');
const router = express.Router();
const { renderTransactionPage, handlePaymentSubmission } = require('../controllers/User'); // Adjust the path as necessary

// Render the transaction page
router.get('/', renderTransactionPage);

// Handle payment submission
router.post('/submit', handlePaymentSubmission);

module.exports = router;
