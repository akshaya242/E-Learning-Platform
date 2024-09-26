const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const teacherController = require('../controllers/teacherController');

// const { ensureAdmin } = require('../middlewares/auth');
const { User } = require('../models/User');
const courseControllers = require('../controllers/courseControllers');

router.get('/teacher/dashboard',teacherController.getDashboard);
router.get('/teacher/create-course',courseControllers.showCourseCreationPage);
router.post('/teacher/create-course', courseControllers.createCourseInfo);
router.get('/teacher/editprofile',teacherController.editprofile);
router.post('/teacher/updateprofile', teacherController.updateProfile);
//router.get('teacher/updatedprofile',teacherController.exports.updatedProfile)
module.exports = router;