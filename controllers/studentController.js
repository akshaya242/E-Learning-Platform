const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course');   
const { Enrollment } = require('../models/Enrollment');
const bcrypt = require('bcrypt');

exports.getDashboard = async (req, res) => {
  try {
    // Fetch the logged-in user from session
    const login = req.session.user;
    req.session.user;
    const user = await User.find();

    // Ensure the user is logged in
    if (!login) {
      return res.status(401).send('Unauthorized: No user logged in');
    }

    // Find the profile of the logged-in user using the user id
    const profile = await Profile.findOne({ user_id: login._id }).exec();

    // Fetch enrolled courses for the logged-in user
    const courses = await Course.find({ enrolledStudents: login._id }).exec();

    // Fetch announcements related to the logged-in user (could be general or user-specific)
    const announcements = [
      { title: 'Academic', message: 'Summer training internship with Live Projects.', time: '2 Minutes Ago' },
      { title: 'Co-curricular', message: 'Global internship opportunity by Student organization.', time: '10 Minutes Ago' },
      { title: 'Examination', message: 'Instructions for Mid Term Examination.', time: 'Yesterday' },
    ];

    // Fetch enrollments for the logged-in user and populate course data
    const enrollments = await Enrollment.find({ student: login._id }).exec();

    // Pass both login info, profile, enrolled courses, announcements, and enrollments to the template
    res.render('studentDashboard', { login, profile, courses, announcements, enrollments , user });

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
      res.redirect('/login');
  });
};

exports.showChangePasswordPage = (req, res) => {
  const user = req.session.user;
  
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
