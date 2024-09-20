const express = require('express');
const router = express.Router();
const controllers = require('../controllers/User'); // Adjust the path as necessary
const adminController = require('../controllers/adminControllers');
const { ensureAdmin } = require('../middlewares/auth');


router.get('/', controllers.home);
router.get('/about', controllers.aboutUs);
router.get('/courses', controllers.course);
router.get('/teachers', controllers.teacher);
router.get('/faqs', controllers.faqs);
router.get('/contact', controllers.contact);
router.get('/signup', controllers.showSignupPage);
router.post('/signup', controllers.handleSignup);
router.get('/login', controllers.showLoginPage);
router.post('/login', controllers.handleLogin);
// router.get('/admin',adminController.getDashboard)
// Dashboard Route (depends on the role)
router.get('/dashboard', controllers.showDashboard);

// Profile Routes
router.get('/profile', controllers.showProfilePage);
router.post('/profile', controllers.updateProfile);
// router.get('/section', controllers.section);
// router.get('/login', controllers.login);
// router.get('/signup', controllers.signupView);
// router.get('/dashboard', controllers.someRedirectView);
// router.get('/logout', controllers.logoutUser);
// router.get('/loginasteacher', controllers.teacherLoginView);
// router.get('/signupasteacher', controllers.teacherSignupView);
// router.get('/teacherdashboard', controllers.someTeacherView);
// router.get('/displaycourse', controllers.displayCourse);
// router.post('/create-course', controllers.createCourse);
// router.post('/contact', controllers.contactSubmit);
// router.post('/  ', controllers.sendMail);

module.exports = router;
