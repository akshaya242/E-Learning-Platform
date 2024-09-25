const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course');   

exports.getDashboard = async (req, res) => {
    try {
        const login = req.session.user;
        if (!login) {
            return res.redirect('/login'); // Redirect to login if session is not set
        }
        
        const users = await User.find();

        // Fetch all courses
        const courses = await Course.find({ instructorId: login.id });

        res.render('teacherDashboard', { login, users,courses });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
};