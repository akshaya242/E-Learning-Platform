const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Enrollment Schema
const enrollmentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  enrollment_date: { type: Date, default: Date.now },
  progress: { type: Number },
  completionStatus: { type: String },
  certificateLink: { type: String }
});

// Payment Schema
const paymentSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Enrollment, Payment };
