// routes/billingRoutes.js
const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing'); // Ensure correct path

const {
    showBillingPage,
    handleCheckout,
} = require('../controllers/User'); // Adjust the path if necessary

// Route to show billing page
router.get('/', showBillingPage);

// Route to handle checkout
router.post('/checkout', handleCheckout);

module.exports = router;
