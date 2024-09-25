const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
// const controllers = require('../controllers/User');
const adminController = require('../controllers/adminControllers');
const { ensureAdmin } = require('../middlewares/auth');
const { User } = require('../models/User');

router.get('/admin/dashboard', adminController.getDashboard);
router.get('/admin/course', adminController.getCourse);
router.post('/create-course', ensureAdmin, adminController.createCourse);
// router.get('/admin',adminController.getDashboard);


router.post('/admin/editUser/:id', async (req, res) => {
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


router.post('/admin/addUser', async (req, res) => {
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

router.post('/admin/deleteUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/Dashboard'); // Redirect back to the users page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user');
    }
});


module.exports = router;
