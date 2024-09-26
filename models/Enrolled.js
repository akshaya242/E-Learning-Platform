const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolledSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // assuming you have a User model
    courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }, // reference to Course model
    enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrolled', enrolledSchema);
