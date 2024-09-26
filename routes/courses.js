const express = require('express');
const router = express.Router();
const courseController = require('../controllers/User');

// Route to get filtered courses
router.get('/filtered', courseController.getFilteredCourses);

module.exports = router;
