const mongoose = require('mongoose');
const { Schema } = mongoose;


// FAQ Schema
const faqSchema = new Schema({
    faq_question: { type: String, required: true },
    faq_answer: { type: String, required: true }
});
const FAQ = mongoose.model('FAQ', faqSchema);

// Teacher Schema
const teacherSchema = new Schema({
    teacher_name: { type: String, required: true, maxlength: 50 },
    image_link: { type: String, required: true, maxlength: 500 },
    bio: { type: String, required: true }
});
const Teacher = mongoose.model('Teacher', teacherSchema);

// Student Schema
const studentSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, maxlength: 100 }
});
studentSchema.methods.setPassword = function(password) {
    // Add password hashing here if needed
};
const Student = mongoose.model('Student', studentSchema);

// Course Schema
const courseSchema = new Schema({
    title: { type: String, required: true, unique: true, maxlength: 100 },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    category: { type: String, required: true, maxlength: 100 },
    description: { type: String, default: 'Enter description here...' },
    link: { type: String, default: null, maxlength: 300 },
    image: { type: String, required: true, maxlength: 500 }
});
const Course = mongoose.model('Course', courseSchema);

// Section Schema
const sectionSchema = new Schema({
    course_title: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, default: 'a', maxlength: 122 },
    videolink: { type: String, default: 'a', maxlength: 122 },
    Overview: { type: String, default: 'a', maxlength: 122 },
    QA: { type: String, default: 'a', maxlength: 122 },
    Notes: { type: String, default: 'a', maxlength: 122 },
    Announcements: { type: String, default: 'a', maxlength: 122 },
    Reviews: { type: String, default: 'a', maxlength: 122 }
});
const Section = mongoose.model('Section', sectionSchema);

// Quiz Schema
const quizSchema = new Schema({
    section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    question: { type: String, required: true, unique: true, maxlength: 122 },
    option1: { type: String, default: 'a', maxlength: 122 },
    option2: { type: String, default: 'a', maxlength: 122 },
    option3: { type: String, default: 'a', maxlength: 122 },
    option4: { type: String, default: 'a', maxlength: 122 }
});
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = {
    FAQ,
    Teacher,
    Student,
    Course,
    Section,
    Quiz
};
