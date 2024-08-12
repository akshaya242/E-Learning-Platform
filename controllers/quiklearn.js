const path = require('path');
const { FAQ, Teacher, Student, Course, Section, Quiz } = require('../models/quiklearn');


const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Home Controller
exports.home = async (req, res) => {
    try {
        const faqs = await FAQ.find().limit(3);
        const teachers = await Teacher.find().limit(4);
        const courses = await Course.find().limit(3);
        // Assuming you're handling data on the client side
        res.sendFile(path.join(__dirname, '../views/homepage.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// About Us Controller
exports.aboutUs = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
};

// Courses Controller
exports.course = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/courses.html'));
};

// Teachers Controller
exports.teacher = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.sendFile(path.join(__dirname, '../views/teacher.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// FAQs Controller
exports.faqs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.sendFile(path.join(__dirname, '../views/faqs.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Contact Controller
exports.contact = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/contact.html'));
};

// Section Controller
exports.section = async (req, res) => {
    try {
        const sections = await Section.find();
        res.sendFile(path.join(__dirname, '../views/showcourse.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Login View Controller
exports.loginView = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

// Signup View Controller
exports.signupView = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
};

// Some Redirect View Controller
exports.someRedirectView = async (req, res) => {
    try {
        const studentName = req.user.username;
        const courses = await Course.find({ "students.username": studentName });
        res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Logout Controller
exports.logoutUser = (req, res) => {
    req.logout();
    res.redirect('/login');
};

// Teacher Login Controller
exports.teacherLoginView = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/loginasteacher.html'));
};

// Teacher Signup View Controller
exports.teacherSignupView = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signupasteacher.html'));
};

// Some Teacher View Controller
exports.someTeacherView = async (req, res) => {
    try {
        const teacherName = req.user.username;
        const courses = await Course.find({ "teacher.name": teacherName });
        res.sendFile(path.join(__dirname, '../views/teacherdashboard.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Display Course Controller
exports.displayCourse = async (req, res) => {
    try {
        const sections = await Section.find();
        res.sendFile(path.join(__dirname, '../views/showcourse.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Create Course Controller
exports.createCourse = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const newCourse = new Course(req.body);
            await newCourse.save();
            res.redirect('/course');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    } else {
        res.sendFile(path.join(__dirname, '../views/create-course.html'));
    }
};

// Contact Form Submission Controller
exports.contactSubmit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).sendFile(path.join(__dirname, '../views/contact.html'));
    }
    const { name, email, message } = req.body;
    try {
        await ContactForm.create({ name, email, message });
        res.sendFile(path.join(__dirname, '../views/success.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Send Mail Controller
exports.sendMail = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Use your preferred mail service to send the email
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};



///ExtrA line