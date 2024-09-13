const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const { Course, Category } = require('./models/Course');
const { Enrollment, Payment } = require('./models/Enrollment');
const { Section, Video, Quiz } = require('./models/Sections');
const { AdminLog, CourseCreationRequest } = require('./models/Admin');
const Notification = require('./models/Notification');
const Review = require('./models/Review');
const Report = require('./models/Report');

const app = express();
const route = require('./routes/quiklearn'); // Correct path to the routes file

// Connect to MongoDB Atlas
const connectMongoDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Seed data function
const seedData = async () => {
    try {
        // Seed Users
        await User.insertMany([
            { email: 'user1@example.com', password: 'password1', name: 'User One', role: 'student' },
            { email: 'user2@example.com', password: 'password2', name: 'User Two', role: 'teacher' },
            { email: 'user3@example.com', password: 'password3', name: 'User Three', role: 'admin' }
        ]);

        // Seed Profiles
        const users = await User.find();
        await Profile.insertMany([
            { user_id: users[0]._id, bio: 'Bio of User One', profile_picture: 'url1', contact_number: '1234567890', address: 'Address 1' },
            { user_id: users[1]._id, bio: 'Bio of User Two', profile_picture: 'url2', contact_number: '1234567891', address: 'Address 2' },
            { user_id: users[2]._id, bio: 'Bio of User Three', profile_picture: 'url3', contact_number: '1234567892', address: 'Address 3' }
        ]);

        // Seed Categories
        const category1 = await Category.create({ name: 'Programming', description: 'Programming courses' });
        const category2 = await Category.create({ name: 'Data Science', description: 'Data Science courses' });
        
        // Seed Courses
        const usersList = await User.find();
        await Course.insertMany([
            { title: 'Intro to Programming', description: 'Learn the basics of programming', category: category1._id, duration: '4 weeks', instructorId: usersList[1]._id, created_by: usersList[1]._id },
            { title: 'Advanced Data Science', description: 'Deep dive into data science', category: category2._id, duration: '8 weeks', instructorId: usersList[1]._id, created_by: usersList[1]._id }
        ]);

        // Seed Enrollments and Payments
        const courses = await Course.find();
        await Enrollment.insertMany([
            { courseId: courses[0]._id, user_id: usersList[0]._id, enrollment_date: new Date(), progress: 50, completionStatus: 'in-progress', certificateLink: '' },
            { courseId: courses[1]._id, user_id: usersList[0]._id, enrollment_date: new Date(), progress: 25, completionStatus: 'in-progress', certificateLink: '' }
        ]);

        await Payment.insertMany([
            { courseId: courses[0]._id, studentId: usersList[0]._id, amountPaid: 100, paymentDate: new Date(), paymentStatus: 'completed' },
            { courseId: courses[1]._id, studentId: usersList[0]._id, amountPaid: 150, paymentDate: new Date(), paymentStatus: 'completed' }
        ]);

        // Seed Sections, Videos, and Quizzes
        const courseList = await Course.find();
        await Section.insertMany([
            { courseId: courseList[0]._id, title: 'Basics of Programming', description: 'Introduction to programming concepts' },
            { courseId: courseList[1]._id, title: 'Data Analysis with Python', description: 'Learn data analysis techniques' }
        ]);

        await Video.insertMany([
            { courseId: courseList[0]._id, title: 'Intro Video', videoUrl: 'url1', duration: '10 mins' },
            { courseId: courseList[1]._id, title: 'Data Analysis Video', videoUrl: 'url2', duration: '20 mins' }
        ]);

        await Quiz.insertMany([
            { courseId: courseList[0]._id, title: 'Programming Basics Quiz', questions: [{ question: 'What is a variable?', answer: 'A storage location' }], answers: [{ answer: 'A storage location' }] },
            { courseId: courseList[1]._id, title: 'Data Analysis Quiz', questions: [{ question: 'What is data normalization?', answer: 'Adjusting data to a common scale' }], answers: [{ answer: 'Adjusting data to a common scale' }] }
        ]);

        // Seed Admin Logs
        await AdminLog.insertMany([
            { admin_id: usersList[2]._id, action: 'Reviewed course creation requests' },
            { admin_id: usersList[2]._id, action: 'Approved new course' }
        ]);

        // Seed Course Creation Requests
        await CourseCreationRequest.insertMany([
            { teacher_id: usersList[1]._id, course_id: courseList[0]._id, status: 'approved', request_date: new Date(), response_date: new Date(), admin_id: usersList[2]._id },
            { teacher_id: usersList[1]._id, course_id: courseList[1]._id, status: 'pending', request_date: new Date() }
        ]);

        // Seed Notifications
        await Notification.insertMany([
            { user_id: usersList[0]._id, message: 'New course available!', read_status: false },
            { user_id: usersList[1]._id, message: 'Course creation approved!', read_status: true }
        ]);

        // Seed Reviews
        await Review.insertMany([
            { courseId: courseList[0]._id, studentId: usersList[0]._id, rating: 4, comment: 'Good course!', created_at: new Date() },
            { courseId: courseList[1]._id, studentId: usersList[0]._id, rating: 5, comment: 'Excellent course!', created_at: new Date() }
        ]);

        // Seed Reports
        await Report.insertMany([
            { teacherId: usersList[1]._id, coursesCreated: 2, studentsEnrolled: 10, averageRating: 4.5 },
            { teacherId: usersList[1]._id, coursesCreated: 1, studentsEnrolled: 5, averageRating: 5 }
        ]);

        console.log('Data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

// Express middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files

app.use(express.static(path.join(__dirname, "public")));
// Set the view engine (if you're using one)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route handling
app.use('/', route);

// Error handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bhai achse kaam kar');
});

// Connect to MongoDB and seed data
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/quiklearn";
connectMongoDB(MONGODB_URI).then(() => seedData());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const importData = async () => {
//     try {
//       // Read the JSON file
//       const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  
//       // Insert data into the User collection
//       await User.insertMany(data);
  
//       console.log('Data successfully imported!');
//       process.exit();
//     } catch (error) {
//       console.error('Error importing data:', error);
//       process.exit(1);
//     }
//   };
  
//   importData();