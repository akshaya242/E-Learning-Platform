const express = require('express');
const router = express.Router();
const controllers = require('../controllers/User');
const courseControllers = require('../controllers/courseControllers');

// Middleware for authentication
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Public Routes
router.get('/', controllers.home);
router.get('/about', controllers.aboutUs);
router.get('/contact', controllers.contact);
router.get('/faqs', controllers.faqs);
router.get('/signup', controllers.showSignupPage);
router.post('/signup', controllers.handleSignup);
router.get('/login', controllers.showLoginPage);
router.post('/login', controllers.handleLogin);
router.get('/teachers', controllers.teacher)

// Dashboard and Courses
router.get('/dashboard', isAuthenticated, controllers.showDashboard);
router.get('/courses', courseControllers.showCourses);
router.post('/enroll/:courseId', isAuthenticated, courseControllers.enrollInCourse);

// Profile
router.get('/profile', isAuthenticated, controllers.showProfilePage);
router.post('/profile', isAuthenticated, controllers.updateProfile);

router.get('/create-course',isAuthenticated,courseControllers.showCourseCreationPage);
router.post('/create-course', courseControllers.createCourseInfo);
// router.get('/course/:courseId', courseControllers.createSectionsForCourse);

router.get('/displaycourse/:courseId',courseControllers.displaycourse);

module.exports = router;
