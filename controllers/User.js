const bcrypt = require('bcrypt');
const { User, Profile } = require('../models/User');
const { Course } = require('../models/Course');
const { Enrollment } = require('../models/Enrollment');
const Billing = require('../models/Billing');  // Adjust the path based on your project structure
const FAQ = require('../models/FAQ'); // Make sure to import your FAQ model


// Home Page Controller
exports.home = async (req, res) => {
    try {
        // Retrieve 3 FAQs from the database
        const faqs = await FAQ.find().limit(3).lean(); // Use .lean() for better performance
        const userId =(req.session.user) ? req.session.user.id : null;
        const user = await User.findById(userId);
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
        res.render('homepage', { faqs, teachers: teacherData, courses: coursesWithInstructors, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


// Static Pages
exports.aboutUs = async(req, res) => {
    const userId =(req.session.user) ? req.session.user.id : null;
        const user = await User.findById(userId);
    res.render('about', { title: 'About Us', user });
};

exports.contact = (req, res) => {
    res.render('contact');
};
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find().lean(); // Fetch all FAQs from the database
        console.log(faqs);
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
    const userId =(req.session.user) ? req.session.user.id : null;
    const user = await User.findById(userId);
    const teachers = await User.find({ role: 'teacher' });
    res.render('teacher', { teachers, user });
};

exports.faqs = async (req, res) => {
    const userId =(req.session.user) ? req.session.user.id : null;
        const user = await User.findById(userId);
    const faqs = await FAQ.find();
    res.render('faqs', { faqs, user });
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

        req.session.user = { id: user._id, name: user.name, role: user.role ,isVerified:user.isVerified, institution:user.institution ,email:user.email };
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
      // Redirect based on user role
      
      req.session.user = {
        id: user._id,  // MongoDB's user ID
        name: user.name,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
        institution:user.institution,
        // Add any other relevant user data
    };
  
    req.session.user = user;

      switch (user.role) {
        case 'admin':
          return res.redirect('/admin/dashboard'); // Redirect admin to their dashboard
  
        case 'teacher':
          // Fetch courses assigned to the teacher
          return res.redirect('/teacher/dashboard');
  
        case 'student':
          // Fetch courses the student is enrolled in
          return res.redirect('/student/Dashboard');
          
  
        default:
          return res.redirect('/login'); // Handle unknown roles
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
  exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    res.render('courses', { courses });
};

exports.getFilteredCourses = async (req, res) => {
    const { search, category } = req.query;
    let query = {};

    // If search is provided, use case-insensitive regex to search in the title
    if (search) {
        query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // If category is provided, filter by category
    if (category) {
        if (Array.isArray(category)) {
            query.category = { $in: category }; // Allow multiple categories
        } else {
            query.category = category; // Single category
        }
    }

    try {
        // Fetch the courses based on the query
        const courses = await Course.find(query);
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.enrollInCourse = async (req, res) => {
  const userId = req.session.user.id;
  console.log(userId)
  const courseId = req.params.courseId;

  try {
      const enrollment = new Enrollment({ courseId, userId });
      await enrollment.save();

      // Add the student ID to the course's enrolledStudents array
      await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId } // Use $addToSet to avoid duplicates
      });

      res.redirect('/courses'); // Redirect to courses page after enrollment
  } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).send('Enrollment failed');
  }
};

exports.enrollInCourse = async (req, res) => {
  console.log("Enrollment request received for course ID:", req.params.courseId);
  const userId = req.session.user.id; // Ensure this ID is correct
  const courseId = req.params.courseId;

  try {
      // Check if the student is already enrolled in the course
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

      // Save enrollment data
      await enrollment.save();

      // Update the course document to append the user's ID to the enrolledStudents array
      await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId }
      });

      res.redirect('/courses'); // Redirect to courses page after enrollment
  } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).send('Enrollment failed');
  }
};
exports.showCart = async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;
    const user = await User.findById(userId);
    if (!userId) {
        return res.status(400).send('User not logged in');
    }

    try {
        // Fetch all the enrollments for the logged-in user
        const enrollments = await Enrollment.find({ user_id: userId }).populate('courseId').lean();

        // Filter out any enrollments where the courseId is null
        const enrolledCourses = enrollments
            .filter(enrollment => enrollment.courseId !== null)
            .map(enrollment => ({
                title: enrollment.courseId.title, // Changed from name to title
                description: enrollment.courseId.description,
                instructorId: enrollment.courseId.instructorId, // Use instructorId
                cost: enrollment.courseId.cost,
                _id: enrollment.courseId._id
            }));

        // To get the instructor name, you may need to populate the instructorId
        const instructorIds = enrolledCourses.map(course => course.instructorId);
        const instructors = await User.find({ _id: { $in: instructorIds } }).lean();
        const instructorMap = instructors.reduce((acc, instructor) => {
            acc[instructor._id] = instructor.name; // Assuming there's a name field in the User model
            return acc;
        }, {});

        // Update the enrolledCourses to include instructor names
        enrolledCourses.forEach(course => {
            course.instructorName = instructorMap[course.instructorId] || 'N/A'; // Use 'N/A' if not found
        });

        // Calculate the total cost of all courses in the cart
        const totalCost = enrolledCourses.reduce((total, course) => total + course.cost, 0);

        // Render the cart.ejs and pass the enrolled courses and total cost to it
        res.render('cart', { enrolledCourses, totalCost, user });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error.message, error.stack);
        res.status(500).send('Server error');
    }
};


// Controller to remove an enrolled course from the cart
exports.removeFromCart = async (req, res) => {
    const userId = req.session.user.id;
    const courseId = req.params.courseId;

    try {
        // Find and delete the enrollment by courseId and user_id
        const deletedEnrollment = await Enrollment.findOneAndDelete({ user_id: userId, courseId });

        if (!deletedEnrollment) {
            return res.status(404).send('Enrollment not found');
        }

        // Redirect back to the cart after successful deletion
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing course from cart:', error);
        res.status(500).send('Server error');
    }
};

// Controller to show billing page
exports.showBillingPage = async (req, res) => {
    const userId = req.session.user.id;
    if (!userId) {
        return res.status(400).send('User not logged in');
    }

    try {
        // Fetch all the enrollments for the logged-in user
        const enrollments = await Enrollment.find({ user_id: userId }).populate('courseId').lean();

        // Calculate total cost and prepare course details
        let totalCost = 0;
        const enrolledCourses = enrollments
            .filter(enrollment => enrollment.courseId !== null)
            .map(enrollment => {
                const courseCost = enrollment.courseId.cost; // Assuming cost is a field in your Course model
                totalCost += courseCost;
                return {
                    name: enrollment.courseId.title,
                    description: enrollment.courseId.description,
                    instructorName: enrollment.courseId.instructorName,
                    cost: courseCost,
                };
            });

        // Render billing page with total cost and enrolled courses
        res.render('billing', { enrolledCourses, totalCost });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error.message, error.stack);
        res.status(500).send('Server error');
    }
};

// Controller to handle checkout form submission
exports.handleCheckout = async (req, res) => {
    try {
        const { name, phone, email, totalCost } = req.body;

        // Validate input fields
        if (!name || !phone || !email || !totalCost) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new billing record
        const billingRecord = new Billing({
            name,
            phone,
            email,
            totalCost,
            // Add userId if needed, e.g. from the session or request
        });

        // Save the billing record to the database
        await billingRecord.save();

        // Redirect to transaction page with the user's name and total cost
        res.redirect(`/payment?name=${encodeURIComponent(name)}&totalCost=${totalCost}`);
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Error during checkout', error: error.message });
    }
};
// Render the transaction page
exports.renderTransactionPage = (req, res) => {
    const { name, totalCost } = req.query;
    res.render('payment', { name, totalCost });
};

// Handle payment submission
exports.handlePaymentSubmission = async (req, res) => {
    const { transactionId, amount } = req.body;
    const name = req.body.name || ""; // Get name from request body or fallback to empty string

    // Validate input fields
    if (!name || !transactionId || transactionId.length !== 10 || !amount) {
        return res.status(400).json({ message: 'All fields are required and Transaction ID must be 10 digits.' });
    }

    try {
        // Update the billing record with the transaction ID
        await Billing.findOneAndUpdate({ name }, { transactionId });

        // Send a success response
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during transaction:', error);
        res.status(500).json({ message: 'Error during transaction', error: error.message });
    }
};
