const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'General', // Optional field for categorizing FAQs
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
