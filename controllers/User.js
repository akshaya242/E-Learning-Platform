const bcrypt = require('bcrypt');
const { User, Profile } = require('../models/User');
const { Course } = require('../models/Course');


const FAQ = require('../models/FAQ'); // Make sure to import your FAQ model


// Home Page Controller
exports.home = async (req, res) => {
    try {
        // Retrieve 3 FAQs from the database
        const faqs = await FAQ.find().limit(3).lean(); // Use .lean() for better performance

        // Retrieve 3 courses from the database
        const courses = await Course.find().limit(3).lean();

        const coursesWithInstructors = await Promise.all(courses.map(async (course) => {
            const instructor = await User.findById(course.instructorId).lean();
            return {
                ...course,
                instructorName: instructor ? instructor.name : 'Unknown',
                instructorEmail: instructor ? instructor.email : 'N/A'
            };
        }));

        // Retrieve 5 teachers from the database
        const teachers = await User.find({ role: 'teacher' }).limit(5).lean();
        const teacherData = await Promise.all(teachers.map(async (teacher) => {
            const profile = await Profile.findOne({ userId: teacher._id });
            return {
                name: teacher.name,
                email: teacher.email,
                imgSrc: profile?.profilePic,
                bio: profile?.bio
            };
        }));

        // Render the homepage with FAQs, teachers, and courses
        res.render('homepage', { faqs, teachers: teacherData, courses: coursesWithInstructors });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Static Pages
exports.aboutUs = (req, res) => {
    res.render('about', { title: 'About Us' });
};

exports.contact = (req, res) => {
    res.render('contact');
};
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().lean(); // Fetch all FAQs from the database
        res.status(200).json(faqs); // Send FAQs as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Courses and Teachers
exports.course = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.teacher = async (req, res) => {
    const teachers = await User.find({ role: 'teacher' });
    res.render('teacher', { teachers });
};

exports.faqs = async (req, res) => {
    const faqs = await FAQ.find();
    res.render('faqs', { faqs });
};

// User Authentication
exports.showSignupPage = (req, res) => {
    res.render('signup');
};

exports.handleSignup = async (req, res) => {
    const { email, password, name, role, institution } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name, role, institution });
        await newUser.save();

        const newProfile = new Profile({ user_id: newUser._id });
        await newProfile.save();

        res.redirect('/login');
    } catch (err) {
        res.redirect('/signup');
    }
};

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        req.session.user = { id: user._id, name: user.name, role: user.role };
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// User Dashboard
exports.showDashboard = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }

    try {
        req.session.user = user;
        switch (user.role) {
            case 'admin':
                return res.redirect('/admin/dashboard');
            case 'teacher':
                const teacherCourses = await Course.find({ teacher: user._id });
                res.render('teacherDashboard', { user, courses: teacherCourses });
                break;
            case 'student':
                const studentCourses = await Course.find({ students: user._id });
                res.render('studentDashboard', { user, courses: studentCourses });
                break;
            default:
                res.status(403).send('Access denied');
        }
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        return res.status(500).send('Server Error');
    }
};

// Profile
exports.showProfilePage = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect('/login');

    const profile = await Profile.findOne({ user_id: user._id });
    res.render('profile', { user, profile });
};

exports.updateProfile = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect('/login');

    const { bio, contact_number, address } = req.body;
    await Profile.updateOne({ user_id: user._id }, { bio, contact_number, address });
    res.redirect('/profile');
};

