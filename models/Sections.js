const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Combined Section Schema
const sectionSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },

  // Video Fields
  video: {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: String }
  },

  // Quiz Fields
  quiz: {
    title: { type: String, required: true },
    questions: [{ type: Schema.Types.Mixed }], // Each question can be an object
    answers: [{ type: Schema.Types.Mixed }]    // Each answer can be an object
  },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
