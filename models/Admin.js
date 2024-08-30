// models/AdminReport.js

const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coursesCreated: { type: Number, default: 0 },
  studentsEnrolled: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
});

module.exports = {
  AdminLog: mongoose.model('AdminLog', adminLogSchema),
  Report: mongoose.model('Report', reportSchema)
};
