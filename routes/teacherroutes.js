const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const teacherController = require('../controllers/teacherController');
// const { ensureAdmin } = require('../middlewares/auth');
const { User } = require('../models/User');

router.get('/teacher/dashboard',teacherController.getDashboard);

module.exports = router;