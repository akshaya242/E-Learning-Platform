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
      const { title, description, category, duration, cost, sections } = req.body;
      console.log(req.body);
      const instructorId = req.session.user ? req.session.user.id : null;
      const created_by = req.session.user ? req.session.user.id : null;

      // Validate required fields
      if (!title || !instructorId || !created_by || !sections || sections.length === 0 || cost === undefined) {
          return res.status(400).json({ message: "All fields are required." });
      }

      // Create the new course object
      const newCourse = new Course({
          title,
          description,
          category,
          duration,
          cost, // Add cost to the course object
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

        res.redirect('/cart');
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

exports.getCourseForEdit = async (req, res) => {
  try {
      const courseId = req.params.courseId; // Get course ID from the request parameters
      const course = await Course.findById(courseId); // Fetch course data from the database
      
      if (!course) {
          return res.status(404).send('Course not found');
      }
      
      // Render the edit course EJS template with the course data
      res.render('edit-course', { course });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
}

exports.updateCourse = async (req, res) => {
  try {
      const courseId = req.params.courseId;
      const updatedCourseData = {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          duration: req.body.duration,
          image: req.body.image,
          cost: req.body.cost,
      };

      const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedCourseData, { new: true });
      
      if (!updatedCourse) {
          return res.status(404).send('Course not found');
      }

      res.redirect('/teacher/dashboard'); // Redirect after successful update
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating course');
  }
};
exports.showEditCourseSection = async (req, res) => {
  console.log("Fetching section for course ID:", req.params.courseId);
  try {
      const courseId = req.params.courseId; // Get course ID from the route parameters
      const sectionId = req.query.sectionId; // Get section ID from query parameters

      // Fetch the course to ensure it exists and retrieve the section IDs
      const course = await Course.findById(courseId).populate('sectionIds');

      if (!course) {
          return res.status(404).send( { message: "Course not found" });
      }

      // Find the specific section based on sectionId
      const section = course.sectionIds.find(sec => sec._id.toString() === sectionId);

      if (!section) {
         return;
      }

      // Render the edit-section view with course and section data
      res.render('edit-section', { section, course });
  } catch (err) {
      console.error(err);
      res.status(500).send( { message: "Error fetching section data" });
  }
};



exports.editCourseSection = async (req, res) => {
  try {
      const { sectionId, title, videoUrl, duration, quizQuestions } = req.body;
      console.log("hello there")
      if (!sectionId || !title || !videoUrl || !duration) {
          return res.status(400).json({ message: "All fields are required." });
      }

      // Find the section by ID and update its details
      const updatedSection = await Section.findByIdAndUpdate(
          sectionId,
          {
              title,
              video: {
                  title: title,
                  videoUrl: videoUrl,
                  duration: duration,
              },
              quiz: {
                  title: title,
                  questions: quizQuestions ? quizQuestions.split(',').map(q => q.trim()) : [],
              },
              updated_at: Date.now(),
          },
          { new: true } // Return the updated section
      );

      if (!updatedSection) {
          return res.status(404).json({ message: "Section not found." });
      }

      // Respond with success
      res.status(200).json({ message: "Section updated successfully", section: updatedSection });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error updating section');
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.courseId;
  console.log(courseId);
  try {
      await Enrollment.deleteMany({courseId: courseId });
      await Course.findByIdAndDelete(courseId);
      res.redirect('/teacher/dashboard');
  } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).send('Server error');
  }
};

exports.progressPerStudent = async (req, res) => {
    const courseId = req.params.courseId;

    try {
        // Fetch the course to get its title and cost
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        // Fetch all enrollments for the course and populate the user details
        const enrollments = await Enrollment.find({ courseId }).populate('user_id', 'name');

        // Prepare data for the response
        const studentProgress = enrollments.map(enrollment => {
            const studentName = enrollment.user_id ? enrollment.user_id.name : 'Unknown'; // Handle null case
            return {
                studentName: studentName,
                progress: enrollment.progress,
            };
        });

        // Calculate additional metrics
        const enrollmentsCount = enrollments.length;
        const totalRevenue = enrollmentsCount * course.cost; // Assuming course.cost holds the course price
        const courseRating = course.rating; // Assuming course.rating holds the course rating

        res.render('studentProgress', { 
            courseTitle: course.title, 
            studentProgress,
            enrollmentsCount,
            totalRevenue,
            courseRating
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching progress data');
    }
};

