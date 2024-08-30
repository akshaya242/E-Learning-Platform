// models/CourseContent.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  duration: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const sectionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  quizIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String },
  created_at: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [{ type: Object }],
  answers: [{ type: Object }],
  created_at: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrollment_date: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  completionStatus: { type: String, default: 'in-progress' },
  certificateLink: { type: String }
});

const courseCreationRequestSchema = new mongoose.Schema({
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  request_date: { type: Date, default: Date.now },
  response_date: { type: Date },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const reviewSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = {
  Course: mongoose.model('Course', courseSchema),
  Section: mongoose.model('Section', sectionSchema),
  Video: mongoose.model('Video', videoSchema),
  Quiz: mongoose.model('Quiz', quizSchema),
  Enrollment: mongoose.model('Enrollment', enrollmentSchema),
  CourseCreationRequest: mongoose.model('CourseCreationRequest', courseCreationRequestSchema),
  Category: mongoose.model('Category', categorySchema),
  Review: mongoose.model('Review', reviewSchema)
};
