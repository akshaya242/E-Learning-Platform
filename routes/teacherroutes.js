const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const teacherController = require('../controllers/teacherController');
const {ensureTeacher} = require('../middlewares/auth');

// const { ensureAdmin } = require('../middlewares/auth');
const { User } = require('../models/User');
const courseControllers = require('../controllers/courseControllers');

router.get('/teacher/dashboard',ensureTeacher,teacherController.getDashboard);
router.get('/teacher/create-course',ensureTeacher,courseControllers.showCourseCreationPage);
router.post('/teacher/create-course',ensureTeacher, courseControllers.createCourseInfo);
router.get('/teacher/editprofile',ensureTeacher,teacherController.editprofile);
router.post('/teacher/updateprofile',ensureTeacher, teacherController.updateProfile);
module.exports = router;