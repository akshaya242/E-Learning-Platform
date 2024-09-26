const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');

// Route to show cart (enrolled courses)
router.get('/', userController.showCart);

// Route to enroll in a course
router.post('/enroll/:courseId', userController.enrollInCourse);

// Route to remove a course from the cart
router.post('/remove/:courseId', userController.removeFromCart);

module.exports = router;
