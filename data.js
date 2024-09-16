const fs = require('fs');
const mongoose = require('mongoose');
const { User, Profile } = require('./models/User');
const { Course, Category } = require('./models/Course');
const { Enrollment, Payment } = require('./models/Enrollment');
const { AdminLog, CourseCreationRequest } = require('./models/Admin');
const { Section, Video, Quiz } = require('./models/Sections');

// Connect to MongoDB
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

const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/quiklearn";
connectMongoDB(MONGODB_URI);

// Function to read and insert data from JSON file
const insertDataFromJson = async (model, filePath) => {
  try {
    if (!model || !model.collection) {
      throw new Error(`Model or collection is undefined for ${filePath}`);
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await model.insertMany(data);
    console.log(`Data successfully imported to ${model.collection.collectionName}`);
  } catch (error) {
    console.error(`Error importing data into ${filePath}:`, error);
  }
};

// Main function to import all data
const importData = async () => {
  try {
    await insertDataFromJson(User, './data/users.json');
    await insertDataFromJson(Profile, './data/profiles.json');
    await insertDataFromJson(Course, './data/courses.json');
    await insertDataFromJson(Category, './data/categories.json');
    await insertDataFromJson(Enrollment, './data/enrollments.json');
    await insertDataFromJson(Payment, './data/payments.json');
    await insertDataFromJson(AdminLog, './data/adminLogs.json');
    await insertDataFromJson(CourseCreationRequest, './data/courseCreationRequests.json');
    await insertDataFromJson(Section, './data/sections.json');
    await insertDataFromJson(Video, './data/videos.json');
    await insertDataFromJson(Quiz, './data/quizzes.json');
    
    console.log('All data successfully imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Call the importData function
importData();
