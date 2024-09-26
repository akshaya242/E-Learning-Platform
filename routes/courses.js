const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const courseController = require('../controllers/User');


// Route to get filtered courses
router.get('/filtered', courseController.getFilteredCourses);


module.exports = router;
