const bcrypt = require('bcrypt');
const FAQ = require('../models/Review');
const { User, Profile } = require('../models/User');
const { Enrollment } = require('../models/Enrollment');
const { CourseCreationRequest } = require('../models/Admin');
const {Course} = require('../models/Course')
const Section = require('../models/Sections')

// Enrollment and Course Requests
exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.createCourseInfo = async (req, res) => {
    try {
        const { title, description, category, duration, sections } = req.body;
        console.log(req.body);
        const instructorId = req.session.user ? req.session.user.id : null;
        const created_by = req.session.user ? req.session.user.id : null;

        if (!title || !instructorId || !created_by || !sections || sections.length === 0) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create the new course object
        const newCourse = new Course({
            title,
            description,
            category,
            duration,
            instructorId,
            sectionIds: [],
            studentsEnrolled: [],
            rating: 0,
            created_by,
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        // Save the course to the database
        const savedCourse = await newCourse.save();

        // Create sections for the course
        const sectionIds = [];
        for (const section of sections) {
            const newSection = new Section({
                courseId: savedCourse._id,
                title: section.title,
                video: {
                    title: section.title || '',
                    videoUrl: section.videoUrl || '',
                    duration: section.duration || '',
                },
                quiz: {
                    title: section.title || '',
                    questions: section.quizQuestions ? section.quizQuestions.split(',').map(q => q.trim()) : [],
                },
                created_at: Date.now(),
                updated_at: Date.now(),
            });

            const savedSection = await newSection.save();
            sectionIds.push(savedSection._id); // Collect section IDs
        }

        // Update the course with the created section IDs
        await Course.findByIdAndUpdate(savedCourse._id, { $push: { sectionIds: { $each: sectionIds } } });

        // Respond with success
        res.status(201).json({ message: "Course created successfully", courseId: savedCourse._id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating course');
    }
};



exports.createCourseSections = async (req, res) => {
    const { title, description, category, sections } = req.body;
  
    // Check if sections is defined and is an array
    if (!Array.isArray(sections)) {
      return res.status(400).send('Sections should be an array.');
    }
  
    try {
      // Create a new Course document using courseId from params
      const courseId = req.params.courseId; // Get courseId from the route
      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).send('Course not found.');
      }
  
      // Process each section and create a Section document
      for (const section of sections) {
        const quizQuestions = section.quizQuestions.split(',').map(q => q.trim()); // Convert to an array
  
        const newSection = new Section({
          courseId: course._id,
          title: section.title,
          video: {
            title: section.title, // Assuming section title can also be the video title
            videoUrl: section.videoUrl,
          },
          quiz: {
            title: section.title, // Assuming section title can also be the quiz title
            questions: quizQuestions,
            answers: [] // Assuming answers are not provided here
          }
        });
  
        await newSection.save();
      }
  
      res.status(201).send('Course created successfully with sections!');
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send('Error saving course or sections');
    }
  };
    

exports.enrollInCourse = async (req, res) => {
    const userId = req.session.user.id;
    const courseId = req.params.courseId;
    console.log(courseId);
    console.log(userId)

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
            $addToSet: { studentsEnrolled: userId }
        });

        res.redirect('/dashboard');
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

exports.displaycourse = async (req,res) => {
try{
  const login = req.session.user;
  const courseId = req.params.courseId;
  console.log(courseId);
  // const idforcourse = await Enrollment.find(courseId);
    // Find the course by ID and populate the sections
    const course = await Course.findById(courseId).populate('sectionIds').exec();
    
    const courseSections = await Section.find({ courseId }).exec();
    const teacher = await User.findOne(course.instructorId);
    // For simplicity, set the first section as the current section
    const currentSection = courseSections[0];
   
  res.render('displaycourse', {
    course: course,
    courseSections: courseSections,
    currentSection: currentSection,
    teacher,
  });
}catch  (err) {
  console.error(err);
  res.status(500).send('Server Error');
}

}

// Unenroll from course controller
exports.unenrollFromCourse = async (req, res) => {
  try {
      // Get course ID from request params
      const courseId = req.params.courseId;
      // Get logged-in user ID (assuming it's available in req.user)
      const userId = req.session.user.id
      console.log("here: "+ courseId);
      console.log("here: "+ userId)
      // Delete the enrollment for the specified course and user
      await Enrollment.deleteOne({ courseId: courseId, user_id: userId });

      // Redirect the user back to the dashboard after successful unenrollment
      res.redirect('/dashboard');
  } catch (error) {
      console.error('Error unenrolling from course:', error);
      // Handle the error, possibly redirect to an error page or show an error message
      res.status(500).send('An error occurred while trying to unenroll from the course.');
  }
};
