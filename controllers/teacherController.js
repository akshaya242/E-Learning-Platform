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
        
        res.render('teacherDashboard', { login, users,courses ,faqs,profile});
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
};
exports.editprofile = async (req,res ) => {
    try {
        const login = req.session.user;
       
        if (!login) {
            return res.redirect('/login'); // Redirect to login if session is not set
        }
        
        const users = await User.find();
        const faqs= await  FAQ.find();
        // Fetch all courses
        // const courses = await Course.find({ instructorId: login.id });
        const profile = await Profile.findOne({ user_id: login.id }).exec();
        console.log(profile);
        res.render('editprofile', { login, users,faqs,profile});
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
    
}

exports.updateProfile = async (req, res) => {
    try {
        const login = req.session.user;

        if (!login) {
            return res.status(401).json({ message: 'Unauthorized: Please log in' });
        }

        const { name, bio, contact_number, address } = req.body;

        // Check if the profile exists and update it
        const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, {
            name,
            bio,
            contact_number,
            address,
        }, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Return a success response with updated profile
        return res.json({ message: 'Profile updated successfully', profile: updatedProfile });

    } catch (error) {
        console.error('Error updating profile:', error); // Log full error for debugging
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

