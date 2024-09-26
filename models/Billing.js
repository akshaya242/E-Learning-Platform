// models/Billing.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    totalCost: { type: Number, required: true },
    transactionId: { type: String, required: false }, 
    // If you are associating billing with a user, you can add:
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
