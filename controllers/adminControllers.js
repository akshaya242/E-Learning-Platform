


const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course');   

exports.getDashboard = async (req, res) => {
    try {
        const login = req.session.user; // Check if session user is set
        
        if (!login) {
            return res.redirect('/login'); // Redirect to login if session is not set
        }
        
        const users = await User.find();

        // Fetch all courses
        const courses = await Course.find();

        // Manually fetch teacher and students for each course
        const enrichedCourses = await Promise.all(
            courses.map(async (course) => {
                // Fetch teacher details (created_by)
                const teacher = await User.findById(course.created_by).select('name email');

                // Fetch enrolled students
                const students = await User.find({
                    _id: { $in: course.studentsEnrolled },
                }).select('name email');

                return {
                    ...course._doc, // Spread course data
                    teacher, // Attach teacher details
                    students, // Attach students details
                };
            })
        );

        res.render('adminDashboard', { login, users, courses: enrichedCourses });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard.');
    }
};


exports.getCourse = async(req,res) => {
    try
    {
        const login = req.session.user;
        res.render('adminCourse',{login});
    }catch(error)
    {
        res.status(500).send('Error getting ccourse dashboard')
    }

}

exports.createCourse = async (req, res) => {
    try {
        const { title, description, teacherId } = req.body;
        const course = new Course({ title, description, teacher: teacherId });
        await course.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send('Error creating course.');
    }
};



