const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');


const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course'); // Import both Course and Category models
const {Enrollment} = require('../models/Enrollment')


exports.home = async (req, res) => {
  try {
    // Fetch limited data from the database
    const faqs = await FAQ.find().limit(3);  // Get 3 FAQs

    // Fetch 3 courses and populate instructor details from User model
    const courses = await Course.find().limit(3).lean();

    // Fetch instructor data for each course based on the instructorId
    const coursesWithInstructors = await Promise.all(courses.map(async (course) => {
      const instructor = await User.findById(course.instructorId).lean();  // Find instructor by instructorId
      return {
        ...course,
        instructorName: instructor ? instructor.name : 'Unknown', // Add instructor name
        instructorEmail: instructor ? instructor.email : 'N/A'    // Add instructor email
      };
    }));

    // Fetch teacher data from User and Profile models
    const teachers = await User.find({ role: 'teacher' }).limit(5).lean();

    // Map teachers with their corresponding profile info
    const teacherData = await Promise.all(teachers.map(async (teacher) => {
      const profile = await Profile.findOne({ userId: teacher._id });  // Find the profile based on userId
      return {
        name: teacher.name,           // Teacher name from User model
        email: teacher.email,         // Teacher email from User model
        imgSrc: profile?.profilePic,  // Profile picture from Profile model
        bio: profile?.bio             // Bio from Profile model
      };
    }));

    // Render the homepage view with fetched data
    res.render('homepage', { faqs, teachers: teacherData, courses: coursesWithInstructors });
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
  
  exports.showDashboard = async (req, res) => {
    const user = req.session.user;  // Assuming user session is stored in req.session
    console.log(user);
    // Check if user is logged in
    if (!user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
  
    try {
      // Redirect based on user role
      
      req.session.user = {
        id: user._id,  // MongoDB's user ID
        name: user.name,
        role: user.role,
        email: user.email,
        // Add any other relevant user data
    };
  
    req.session.user = user;

      switch (user.role) {
        case 'admin':
          return res.redirect('/admin'); // Redirect admin to their dashboard
  
        case 'teacher':
          // Fetch courses assigned to the teacher
          const teacherCourses = await Course.find({ created_by: user._id }); // Assuming created_by field for courses
          return res.render('teacherDashboard', { user, courses: teacherCourses });
  
        case 'student':
          // Fetch courses the student is enrolled in
          return res.redirect('/student/Dashboard');
          
  
        default:
          return res.status(403).send('Access denied'); // Handle unknown roles
      }
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      return res.status(500).send('Server Error');
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
  exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.enrollInCourse = async (req, res) => {
  const userId = req.session.user.id;
  console.log(userId)
  const courseId = req.params.courseId;

  try {
      const enrollment = new Enrollment({ courseId, userId });
      await enrollment.save();

      // Add the student ID to the course's enrolledStudents array
      await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId } // Use $addToSet to avoid duplicates
      });

      res.redirect('/courses'); // Redirect to courses page after enrollment
  } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).send('Enrollment failed');
  }
};

exports.enrollInCourse = async (req, res) => {
  console.log("Enrollment request received for course ID:", req.params.courseId);
  const userId = req.session.user.id; // Ensure this ID is correct
  const courseId = req.params.courseId;

  try {
      // Check if the student is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({ courseId, user_id: userId });
      
      if (existingEnrollment) {
          return res.status(400).send('You are already enrolled in this course.');
      }

      const enrollment = new Enrollment({
          courseId,
          user_id: userId,
          enrollment_date: new Date(),
          progress: 0,
          completionStatus: 'in-progress',
          certificateLink: null 
      });

      // Save enrollment data
      await enrollment.save();

      // Update the course document to append the user's ID to the enrolledStudents array
      await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId }
      });

      res.redirect('/courses'); // Redirect to courses page after enrollment
  } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).send('Enrollment failed');
  }
};


