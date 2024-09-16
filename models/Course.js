const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Course Schema
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  duration: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Course = mongoose.model('Course', courseSchema);
const Category = mongoose.model('Category', categorySchema);

module.exports =  Course ;
module.exports = Category;