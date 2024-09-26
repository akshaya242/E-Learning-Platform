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

router.get('/courses', isAuthenticated, controllers.showCourses);
router.post('/enroll/:courseId', isAuthenticated, controllers.enrollInCourse);

// Cart Routes
router.get('/cart', isAuthenticated, controllers.showCart); // Route to show the cart
router.post('/remove/:courseId', isAuthenticated, controllers.removeFromCart); // Route to remove a course from the cart

// Profile
router.get('/profile', isAuthenticated, controllers.showProfilePage);
router.post('/profile', isAuthenticated, controllers.updateProfile);

router.get('/create-course',isAuthenticated,courseControllers.showCourseCreationPage);
router.post('/create-course', courseControllers.createCourseInfo);
//router.get('/course/:courseId', courseControllers.createSectionsForCourse);


module.exports = router;
