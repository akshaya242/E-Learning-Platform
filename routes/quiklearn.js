const express = require('express');
const router = express.Router();
const controllers = require('../controllers/User'); // Adjust the path as necessary

router.get('/', controllers.home);
router.get('/about', controllers.aboutUs);
router.get('/courses', controllers.course);
router.get('/teachers', controllers.teacher);
router.get('/faqs', controllers.faqs);
router.get('/contact', controllers.contact);
// router.get('/section', controllers.section);
router.get('/login', controllers.login);
// router.get('/signup', controllers.signupView);
// router.get('/dashboard', controllers.someRedirectView);
// router.get('/logout', controllers.logoutUser);
// router.get('/loginasteacher', controllers.teacherLoginView);
// router.get('/signupasteacher', controllers.teacherSignupView);
// router.get('/teacherdashboard', controllers.someTeacherView);
// router.get('/displaycourse', controllers.displayCourse);
// router.post('/create-course', controllers.createCourse);
// router.post('/contact', controllers.contactSubmit);
// router.post('/  ', controllers.sendMail);

module.exports = router;
