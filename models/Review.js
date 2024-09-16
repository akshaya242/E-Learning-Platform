const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Review Schema
const reviewSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
