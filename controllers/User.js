const path = require('path');
const express = require('express');



const FAQ = require('../models/Review');       // Import FAQ model
const User = require('../models/User');  // Import Teacher model
const Course = require('../models/Course'); // Import Course model

exports.home = async (req, res) => {
    try {
        // Fetch limited data from the database
        const faqs = await FAQ.find().limit(3);              // Get 3 FAQs
        const teachers = await User.find({ role: 'teacher' }).limit(4);  // Get 4 users with role 'teacher'
        const courses = await Course.find();      // Get 3 Courses

        // Render the homepage view with fetched data
        res.render('homepage', { faqs, teachers, courses });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
