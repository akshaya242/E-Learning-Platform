const bcrypt = require('bcrypt');
const FAQ = require('../models/Review');
const { User, Profile } = require('../models/User');
const { Enrollment } = require('../models/Enrollment');
const { CourseCreationRequest } = require('../models/Admin');
const {Course} = require('../models/Course')

// Enrollment and Course Requests
exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.createCourseInfo = async (req, res) => {
    try {
      const { title, description, category, duration } = req.body;
      const image = req.body.image; // Typically image would be from req.file if multer is used
      
      // Create the new course object
      const newCourse = new Course({
        title,
        description,
        category,
        duration,
        role: req.user._id, // Assuming the instructor's role (logged-in user)
        sectionIds: [], // Initially empty array
        studentsEnrolled: [], // Initially empty array
        rating: 0, // Default rating
        created_by: req.user._id, // Instructor is the logged-in user
        created_at: Date.now(),
        updated_at: Date.now(),
        image // Assuming this is the image URL or filename
      });
  
      // Save the course to the database
      await newCourse.save();
  
      // Render the course sections page, or redirect as needed
      res.render('course-section', { title, description, category, duration });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating course');
    }
  };

exports.createCourseSections = async (req, res) => {
  const { title, description, category, sections } = req.body;
  
  try {
      const course = new Course({
          title,
          description,
          category,
          sections
      });
      await course.save();

      res.status(201).send('Course created successfully!');
  } catch (error) {
      res.status(500).send('Error saving course');
  }
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

exports.showCourseCreationPage = async (req, res) => {
//   if (req.user && req.user.role === 'teacher') {
    res.render('course_info.ejs');
//   } else {
//     res.redirect('/dashboard');
//   }
}


