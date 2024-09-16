const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Report Schema
const reportSchema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coursesCreated: { type: Number },
  studentsEnrolled: { type: Number },
  averageRating: { type: Number }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
