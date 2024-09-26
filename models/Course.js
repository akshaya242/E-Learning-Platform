const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Course Schema
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  duration: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'User', required: false},
  instructorId: {type: Schema.Types.ObjectId, ref: 'User' },
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  image: { type: String },
  cost: { type: Number, default: 0 } 
});

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

// Define models if they are not already defined
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = {
  Course,
  Category,
};
