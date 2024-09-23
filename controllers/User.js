const path = require('path');
const bcrypt = require('bcrypt');
const FAQ = require('../models/Review');
const { User, Profile } = require('../models/User');
const { Course } = require('../models/Course');
const { Enrollment } = require('../models/Enrollment');
const { AdminLog, CourseCreationRequest } = require('../models/Admin');

exports.home = async (req, res) => {
    try {
        const faqs = await FAQ.find().limit(3);
        const courses = await Course.find().limit(3).lean();

        const coursesWithInstructors = await Promise.all(courses.map(async (course) => {
            const instructor = await User.findById(course.instructorId).lean();
            return {
                ...course,
                instructorName: instructor ? instructor.name : 'Unknown',
                instructorEmail: instructor ? instructor.email : 'N/A'
            };
        }));

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

        res.render('homepage', { faqs, teachers: teacherData, courses: coursesWithInstructors });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.aboutUs = (req, res) => {
    res.render('about', { title: 'About QuikLearn' });
};

exports.contact = (req, res) => {
    res.render('contact');
};

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

exports.showDashboard = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }

    try {
        switch (user.role) {
            case 'admin':
                return res.redirect('/admin');
            case 'teacher':
                const teacherCourses = await Course.find({ created_by: user._id });
                return res.render('teacherDashboard', { user, courses: teacherCourses });
            case 'student':
                const studentCourses = await Course.find({ studentsEnrolled: user._id });
                return res.render('studentDashboard', { user, courses: studentCourses });
            default:
                return res.status(403).send('Access denied');
        }
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        return res.status(500).send('Server Error');
    }
};

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

exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.enrollInCourse = async (req, res) => {
    const userId = req.session.user.id;
    const courseId = req.params.courseId;

    try {
        const existingEnrollment = await Enrollment.findOne({ courseId, user_id: userId });
        if (existingEnrollment) {
            return res.status(400).send('You are already enrolled in this course.');
        }

        const enrollment = new Enrollment({
            courseId,
            user_id: userId,
            enrollment_date: new Date(),
            progress: 0,
            completionStatus: 'in-progress',
            certificateLink: null 
        });

        await enrollment.save();
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: userId }
        });

        res.redirect('/courses');
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).send('Enrollment failed');
    }
};

exports.createCourseRequest = async (req, res) => {
  const { title, description, category, sections } = req.body;
  const teacherId = req.session.user.id;

  try {
      const newRequest = new CourseCreationRequest({
          teacher_id: teacherId,
          status: 'pending',
      });

      await newRequest.save();
      res.status(200).send('Course creation request submitted successfully.');
  } catch (err) {
      res.status(500).send('Failed to submit the course creation request.');
  }
};

exports.approveCourseRequest = async (req, res) => {
  const { requestId, courseData } = req.body;
  const adminId = req.session.user.id;

  try {
      const courseRequest = await CourseCreationRequest.findById(requestId);
      if (!courseRequest || courseRequest.status !== 'pending') {
          return res.status(400).send('Invalid or already processed request.');
      }

      const newCourse = new Course({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          created_by: courseRequest.teacher_id,
      });

      await newCourse.save();

      courseRequest.status = 'approved';
      courseRequest.course_id = newCourse._id;
      courseRequest.response_date = new Date();
      courseRequest.admin_id = adminId;
      await courseRequest.save();

      res.status(200).send('Course created and request approved.');
  } catch (err) {
      res.status(500).send('Failed to approve course request.');
  }
};

exports.showCreatePage = async(req, res) => {
  res.render('course_request')
}

