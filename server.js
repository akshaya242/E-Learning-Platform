const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');


const app = express();
const route = require('./routes/quiklearn'); // Correct path to the routes file
const route1 = require('./routes/teacherroutes');
const route2 = require('./routes/studentroutes');

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

// Express middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files

app.use(express.static(path.join(__dirname, "public")));
// Set the view engine (if you're using one)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'simpleSecretKey',  // Simple, hardcoded secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set to true if using HTTPS
  }));

// Route handling
app.use('/', route);
const route3 = require('./routes/adminRoutes');
app.use('/', route3);





// Error handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});


// Connect to MongoDB and seed data
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/quiklearn";
connectMongoDB(MONGODB_URI, {connectTimeoutMS: 20000,});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


