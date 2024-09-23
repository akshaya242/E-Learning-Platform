const express = require('express');
const router = express.Router();
const controllers = require('../controllers/User');
const adminController = require('../controllers/adminControllers'); // Ensure you import your admin controllers
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
router.get('/dashboard', controllers.showDashboard);

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

router.get('/courses', isAuthenticated, controllers.showCourses);
router.post('/enroll/:courseId', isAuthenticated, controllers.enrollInCourse);

// Profile Routes
router.get('/profile', isAuthenticated, controllers.showProfilePage);
router.post('/profile', isAuthenticated, controllers.updateProfile);
// Use the middleware
router.get('/create-course', isAuthenticated, controllers.showCreatePage);
router.post('/create-course', isAuthenticated, controllers.createCourseRequest);
router.post('/approve-course', isAuthenticated, controllers.approveCourseRequest);


module.exports = router;
