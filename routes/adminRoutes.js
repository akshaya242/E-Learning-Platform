const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
// const controllers = require('../controllers/User');
const adminController = require('../controllers/adminControllers');
const { ensureAdmin } = require('../middlewares/auth');
const { User } = require('../models/User');
const { Course } = require('../models/Course');
const Sections  = require('../models/Sections');

router.use(express.urlencoded({ extended: true }));

router.get('/admin/dashboard',ensureAdmin, adminController.getDashboard);
router.post('/create-course', ensureAdmin, adminController.createCourse);
router.post('/admin/editUser/:id', ensureAdmin,async (req, res) => {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    try {
        // Update the user by ID
        await User.findByIdAndUpdate(userId, {
            name,
            email,
            role,
            updated_at: Date.now()
        });

        // Redirect after success
        res.redirect('/admin/Dashboard');  // Adjust the redirect based on your UI
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
});


router.post('/admin/addUser',ensureAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        // Create a new user document
        
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with salt rounds = 10
        
        // Create a new user document with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,  // Save the hashed password
            role,
            isVerified: false  // Default value for isVerified
        });
        // Save the new user to the database
        await newUser.save();
        // Redirect back to admin page or wherever you need to go after the user is added
        res.redirect('/admin/Dashboard');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Server error');
    }
});

router.post('/admin/deleteUser/:id', ensureAdmin,async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        await Enrollment.deleteMany({courseId: userId });
        res.redirect('/admin/Dashboard'); // Redirect back to the users page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
});
//This is for Courses
router.get('/admin/Course',ensureAdmin, adminController.getCourses);
router.post('/admin/Course/add',ensureAdmin, adminController.addCourse);
router.post('/admin/Course/edit/:id',ensureAdmin, adminController.editCourse);
router.post('/admin/Course/delete/:id',ensureAdmin, adminController.deleteCourse);
router.get('/admin/Course/delete/:id',ensureAdmin, adminController.deleteCourse); 


//This is for overview section
router.get('/admin/Overview',ensureAdmin, adminController.getOverview);

// router.post('/admin/Section/add', async (req, res) => {
//     const { courseId, title, description, video, quiz } = req.body;

//     try {
//         const newSection = new Section({
//             courseId,
//             title,
//             description,
//             video,
//             quiz
//         });

//         await newSection.save();

//         // Add the new section ID to the course
//         await Course.findByIdAndUpdate(courseId, {
//             $push: { sectionIds: newSection._id }
//         });

//         res.redirect(`/admin/Course/${courseId}`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Edit an existing section
// router.post('/admin/Section/edit/:sectionId', async (req, res) => {
//     const { sectionId } = req.params;
//     const { title, description, video, quiz } = req.body;

//     try {
//         const updatedSection = await Section.findByIdAndUpdate(sectionId, {
//             title,
//             description,
//             video,
//             quiz
//         }, { new: true });

//         res.redirect(`/admin/Course/${updatedSection.courseId}`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Delete a section from a course
// router.post('/admin/Section/delete/:sectionId', async (req, res) => {
//     const { sectionId } = req.params;

//     try {
//         const section = await Section.findByIdAndDelete(sectionId);

//         // Remove the section from the course
//         await Course.findByIdAndUpdate(section.courseId, {
//             $pull: { sectionIds: sectionId }
//         });

//         res.redirect(`/admin/Course/${section.courseId}`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });


router.get('/admin/Course/:courseId/sections', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('sectionIds');
        console.log(course.sectionIds); // Log sections to ensure they are populated
        res.render('adminSection', { course });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to handle updating a section
router.post('/admin/Section/update/:sectionId', async (req, res) => {
    const { sectionId } = req.params;
    const { title, description, video, quiz } = req.body;

    try {
        const updatedSection = await Sections.findByIdAndUpdate(sectionId, {
            title,
            description,
            video: {
                title: video.title,
                videoUrl: video.videoUrl,
                duration: video.duration
            },
            quiz: {
                title: quiz.title,
                questions: JSON.parse(quiz.questions), // Assuming questions and answers are arrays
                answers: JSON.parse(quiz.answers)
            }
        }, { new: true });

        res.redirect(`/admin/Course/${updatedSection.courseId}/sections`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/admin/logout', adminController.logout);


module.exports = router;
