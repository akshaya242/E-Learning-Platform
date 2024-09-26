const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course');   
const { Enrollment } = require('../models/Enrollment');
const bcrypt = require('bcrypt');
const path = require('path');

exports.getDashboard = async (req, res) => {
  try {
    // Fetch the logged-in user from session
    const login = req.session.user;

    // Ensure the user is logged in
    if (!login) {
      return res.status(401).send('Unauthorized: No user logged in');
    }

    // Get the current logged-in user's ID
    const userId = login.id;

    // Find the profile of the logged-in user using the user ID
    const profile = await Profile.findOne({ user_id: userId }).exec();
    const loginUser = await User.findById(login.id);
    console.log(loginUser)

    const enrollments = await Enrollment.find({ user_id: userId })
    .populate({
      path: 'courseId',      // Populate courseId
      select:'title',        // Select only the 'name' field from the Course model
    })
    .exec();
    console.log(login);
    // Fetch courses based on the enrollments (if needed)
    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).exec();
     const user= await User.find();
    // Fetch announcements related to the logged-in user (could be general or user-specific)
    const announcements = [
      { title: 'Academic', message: 'Summer training internship with Live Projects.', time: '2 Minutes Ago' },
      { title: 'Co-curricular', message: 'Global internship opportunity by Student organization.', time: '10 Minutes Ago' },
      { title: 'Examination', message: 'Instructions for Mid Term Examination.', time: 'Yesterday' },
    ];

    // Pass login info, profile, enrolled courses, announcements, and enrollments to the template
    res.render('studentDashboard', { login, profile, courses, announcements, enrollments, loginUser,user });

  } catch (error) {
    console.error('Error fetching dashboard:', error);  // Log the actual error for debugging
    res.status(500).send('Error loading dashboard.');
  }
};

exports.logout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
      if (err) {
          console.log('Error destroying session during logout:', err);
          return res.status(500).send('An error occurred while logging out.');
      }

      // Optionally clear the cookie
      res.clearCookie('connect.sid', { path: '/' });

      // Redirect to the login page (or home)
      res.redirect('/');
  });
};

exports.showChangePasswordPage = (req, res) => {
  const user = req.session.user ? req.session.user : null;
  
  if (!user) return res.redirect('/login');  // Ensure the user is logged in

  res.render('changePassword', { user });
};
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = req.session.user; // Get the logged-in user from session
  console.log(user);
  try {
    // Ensure the user is logged in
    
     
    console.log(user);
    if (!user) {
      return res.status(401).send('Unauthorized: No user logged in');
    }

    // Validate input fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).send('Please fill in all fields');
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send('New passwords do not match');
    }
    console.log(user);
    // Find the user in the database
    const foundUser = await User.findById(user.id).exec();
    
    // Check if the user was found
    if (!foundUser) {
      return res.status(404).send('User not found');
    }

    // Check if the current password matches the user's existing password
    const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    foundUser.password = hashedNewPassword;
    await foundUser.save();

    // Redirect or send a success message
    res.status(200).send('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Server error');
  }
};
