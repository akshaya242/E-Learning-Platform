// const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course');   
const FAQ = require('../models/FAQ');

exports.getDashboard = async (req, res) => {
    try {
        const login = req.session.user;
        console.log(login);
        if (!login) {
            return res.redirect('/login'); // Redirect to login if session is not set
        }
        
        const users = await User.find();
        const faqs= await  FAQ.find();
        // Fetch all courses
        const courses = await Course.find({ instructorId: login.id });
        const profile = await Profile.findOne({ user_id: login.id }).exec();
        console.log(profile);
        res.render('teacherDashboard', { login, users,courses ,faqs,profile});
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
};
exports.editprofile = async (req,res ) => {
    try {
        const login = req.session.user;
        console.log(login);
        if (!login) {
            return res.redirect('/login'); // Redirect to login if session is not set
        }
        
        const users = await User.find();
        const faqs= await  FAQ.find();
        // Fetch all courses
        // const courses = await Course.find({ instructorId: login.id });
        const profile = await Profile.findOne({ user_id: login.id }).exec();
        console.log(Profile);
        res.render('editprofile', { login, users,faqs,profile});
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
    
}

exports.updateProfile = async (req, res) => {
    try {
        const login = req.session.user; // Assuming you're using session for login
        console.log('Form Data:', req.body); // Log the incoming form data

        if (!login) {
            return res.redirect('/login'); // Redirect if not logged in
        }

        const { name, bio, contact_number, address } = req.body;

        // Find and update the profile
        const updatedProfile = await Profile.findOneAndUpdate(
            { user_id: login._id },
            { name , bio, contact_number, address },
            { new: true } // Return the updated document
        );

        res.redirect('/teacher/dashboard'); // Redirect back to the dashboard after updating
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server error');
    }
};