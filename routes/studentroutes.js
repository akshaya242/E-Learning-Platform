const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/student/dashboard', studentController.getDashboard);
router.get('/', studentController.logout);
router.get('/logout', studentController.logout);


router.get('/change-password', studentController.showChangePasswordPage);
// Route to handle the password change request
router.post('/change-password', studentController.changePassword);

module.exports = router;
