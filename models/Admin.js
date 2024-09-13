const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// AdminLog Schema
const adminLogSchema = new Schema({
  admin_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// CourseCreationRequest Schema
const courseCreationRequestSchema = new Schema({
  teacher_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true },
  request_date: { type: Date, default: Date.now },
  response_date: { type: Date },
  admin_id: { type: Schema.Types.ObjectId, ref: 'User' }, // Nullable
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
const CourseCreationRequest = mongoose.model('CourseCreationRequest', courseCreationRequestSchema);

module.exports = { AdminLog, CourseCreationRequest };
