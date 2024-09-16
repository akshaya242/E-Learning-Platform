const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Section Schema
const sectionSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoIds: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
  pdfIds: [{ type: Schema.Types.ObjectId, ref: 'PDF' }],
  quizIds: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Video Schema
const videoSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String },
  created_at: { type: Date, default: Date.now }
});

// Quiz Schema
const quizSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [{ type: Schema.Types.Mixed }], // Each question can be an object
  answers: [{ type: Schema.Types.Mixed }], // Each answer can be an object
  created_at: { type: Date, default: Date.now }
});

const Section = mongoose.model('Section', sectionSchema);
const Video = mongoose.model('Video', videoSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Section, Video, Quiz };
