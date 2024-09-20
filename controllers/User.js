const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');


const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course'); // Import both Course and Category models


exports.home = async (req, res) => {
    try {
        // Fetch limited data from the database
        const faqs = await FAQ.find().limit(3);              // Get 3 FAQs
        const teachers = await User.find({ role: 'teacher' }).limit(5);  // Get 4 users with role 'teacher'
        const courses = await Course.find();      // Get 3 Courses

        // Render the homepage view with fetched data
        res.render('homepage', { faqs: faqs, teachers: teachers, courses: courses });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.aboutUs = (req, res) => {
    res.render('about', {
        title: 'About QuikLearn'
        
    });
};

exports.contact = (req, res) => {
    res.render('contact');
};

exports.course = async (req, res)=> {
    const courses = await Course.find();
    res.render('courses', {courses: courses})
}

exports.teacher = async (req, res)=> {
    const teachers = await User.find({role: 'teacher'});
    res.render('teacher', {teachers: teachers})
}

exports.faqs = async (req, res)=> {
    const faqs = await FAQ.find();
    res.render('faqs', {faqs: faqs})
}



exports.showSignupPage = (req, res) => {
    res.render('signup');
  };
  
  // Handle Signup
  exports.handleSignup = async (req, res) => {
    const { email, password, name, role, institution } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, name, role, institution });
      await newUser.save();
  
      // Create profile
      const newProfile = new Profile({ user_id: newUser._id });
      await newProfile.save();
  
      res.redirect('/login');
    } catch (err) {
      res.redirect('/signup');
    }
  };
  
  // Show Login Page
  exports.showLoginPage = (req, res) => {
    res.render('login');
  };
  
  // Handle Login
  exports.handleLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send('Invalid email or password');
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid email or password');
      }
      console.log('Session after login:', req.session);
      // Set session user
      req.session.user = {
        id: user._id,
        name: user.name,
        role: user.role
      };
  
      // Redirect to dashboard
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
  
  exports.showDashboard = (req, res) => {
    const user = req.session.user;
  
    // Check if user is logged in
    if (!user) {
      return res.redirect('/login'); // Redirect to login if user is not authenticated
    }
  
    // Check user role and render the corresponding dashboard
    switch (user.role) {
      case 'admin':
        res.render('adminDashboard', { user });
        break;
      case 'teacher':
        res.render('teacherDashboard', { user });
        break;
      case 'student':
        res.render('studentDashboard', { user });
        break;
      default:
        res.status(403).send('Access denied'); // Handle unknown roles
    }
  };
  
  
  // Show Profile Page
  exports.showProfilePage = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect('/login');
    
    const profile = await Profile.findOne({ user_id: user._id });
    res.render('profile', { user, profile });
  };
  
  // Update Profile
  exports.updateProfile = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect('/login');
    
    const { bio, contact_number, address } = req.body;
    await Profile.updateOne({ user_id: user._id }, { bio, contact_number, address });
    res.redirect('/profile');
  };