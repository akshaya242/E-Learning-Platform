const express = require('express');
const router = express.Router();
const controllers = require('../controllers/User');
const adminController = require('../controllers/adminControllers');
const { ensureAdmin } = require('../middlewares/auth');

router.get('/admin/dashboard', adminController.getDashboard);
router.post('/create-course', ensureAdmin, adminController.createCourse);
router.get('/admin',adminController.getDashboard);

// router.post('/addUser', adminController.addUser);
// router.post('/editUser/:id', adminController.editUser);
// router.post('/editCourse/:id', adminController.editCourse);
module.exports = router;
