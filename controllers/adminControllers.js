


const FAQ = require('../models/Review');       // Import FAQ model
const {User, Profile} = require('../models/User');
const { Course, Category } = require('../models/Course'); 
const path = require('path');
const {Enrollment } =  require('../models/Enrollment')

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


//exports.getCourse = async(req,res) => {
//     try
//     {
//         const login = req.session.user;
//         res.render('adminCourse',{login});
//     }catch(error)
//     {
//         res.status(500).send('Error getting ccourse dashboard')
//     }

// }

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

exports.getCourses = async (req, res) => {
    try {
        const login = req.session.user;

        // Fetch all courses and populate 'created_by' (teacher)
        const courses = await Course.find().populate('created_by', 'name');

        // Extract unique categories from the courses
        const uniqueCategories = [...new Set(courses.map(course => course.category).filter(Boolean))];
        const categories = await Category.find();
        const teachers = await User.find({ role: 'teacher' }).select('_id name');
        res.render('adminCourse', { login, courses, teachers, uniqueCategories,categories });
    } catch (error) {
        res.status(500).send('Error loading courses.');
    }
};
    

// Add Course
exports.addCourse = async (req, res) => {
    try {
      const { title, description, duration,custom_category, created_by, role } = req.body;
      let { category } = req.body;
      const teacherUser = await User.findOne({ role: 'teacher' });
      // Check if a file is uploaded
      if (!req.files || !req.files.image) {
        return res.status(400).send('No file uploaded.');
      }
      
      const imageFile = req.files.image;
  
      // Define the upload path
      const uploadPath = path.join(__dirname, '..', 'uploads/images', Date.now() + path.extname(imageFile.name));
  
      // Move the file to the uploads folder
      imageFile.mv(uploadPath, async (err) => {
        if (err) {
          console.error('File upload error:', err);
          return res.status(500).send('File upload failed.');
        }
        if (category === 'other' && custom_category) {
            category = custom_category; // Use the custom category entered by the user
        }
  
        // Create the course with the uploaded image
        const newCourse = new Course({
          title,
          description,
          duration,
          category,
          created_by,
          role: teacherUser._id, 
          image: path.basename(uploadPath), // Save the image filename in the database
        });
  
        await newCourse.save();
        res.redirect('/admin/Course');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  };

// Edit Course
exports.editCourse = async (req, res) => {
    try {
        const { title, description, duration, category, custom_category, created_by } = req.body;

        // Use custom category if provided
        const finalCategory = category === 'other' ? custom_category : category;

        await Course.findByIdAndUpdate(req.params.id, {
            title,
            description,
            duration,
            category: finalCategory,
            created_by,
            updated_at: Date.now(),
            image: req.file ? req.file.path : undefined // Assuming image upload is handled
        });

        res.redirect('/admin/Course'); // Redirect after successful edit
    } catch (error) {
        res.status(500).send('Error updating course.');
    }
};


// Delete Course
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        await Enrollment.deleteMany({courseId: id });
        await Course.findByIdAndDelete(id);
        res.redirect('/admin/Course');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Server error');
    }
};


// geT OVERVIEW 
exports.getOverview = async (req,res)  => {
    try {
        const login  = req.session.user;
        console.log(login)
        // Fetch key metrics
        const totalCourses = await Course.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalEnrollments = await Course.aggregate([{ $group: { _id: null, total: { $sum: { $size: "$studentsEnrolled" } } } }]);

        const avgCourseRating = await Course.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }]);

        // Group by role for user distribution
        const userDistribution = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        // Course popularity by enrollments
        const popularCourses = await Course.find()
            .sort({ studentsEnrolled: -1 })
            .limit(5)
            .select('title studentsEnrolled');

        // Monthly enrollments (simplified, assuming created_at is used to track enrollments)
        const monthlyEnrollments = await Course.aggregate([
            { $unwind: "$studentsEnrolled" },
            { $group: { _id: { month: { $month: "$created_at" }, year: { $year: "$created_at" } }, count: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.render('adminOverview', {
            login,
            totalCourses,
            totalUsers,
            totalTeachers,
            totalStudents,
            totalEnrollments: totalEnrollments[0] ? totalEnrollments[0].total : 0,
            avgCourseRating: avgCourseRating[0] ? avgCourseRating[0].avgRating : 0,
            userDistribution,
            popularCourses,
            monthlyEnrollments,
          
        });
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        res.status(500).send("Server Error");
    }
};

exports.viewSection = async (req, res) => {
    try {
        const login = req.session.login;
        const courseId = req.params.id;
        const courseSections = await Section.find({ courseId }).exec();
        res.render('adminSection',{ courseSections }); // Redirect after successful edit
    } catch (error) {
        res.status(500).send('Error updating course.');
    }
};
exports.editedSection = async (req, res) => {
    try {
        const { title, description, duration, category, custom_category, created_by } = req.body;

        // Use custom category if provided
        const finalCategory = category === 'other' ? custom_category : category;

        await Course.findByIdAndUpdate(req.params.id, {
            title,
            description,
            duration,
            category: finalCategory,
            created_by,
            updated_at: Date.now(),
            image: req.file ? req.file.path : undefined // Assuming image upload is handled
        });

        res.redirect('/admin/Course'); // Redirect after successful edit
    } catch (error) {
        res.status(500).send('Error updating course.');
    }
};


exports.logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session during logout:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
  
        // Optionally clear the cookie
        res.clearCookie('connect.sid', { path: '/' });
  
        // Redirect to the login page (or home)
        res.redirect('/login');
    });
  };
  