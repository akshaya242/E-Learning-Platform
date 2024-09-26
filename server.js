const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');


const app = express();
const route = require('./routes/quiklearn'); // Main application routes
const route1 = require('./routes/teacherroutes'); // Teacher-related endpoints
const route2 = require('./routes/studentroutes'); // Student-related endpoints
const route3 = require('./routes/adminRoutes'); // Admin-related endpoints
const courseRoutes = require('./routes/courses'); // Add this line for course routes
const cartRoutes = require('./routes/cart'); // Cart routes
const billingRoutes = require('./routes/billingRoutes'); // Billing routes
const paymentRoutes = require('./routes/paymentRoutes'); // Payment routes
const notesRoute = require('./routes/notesRoute'); // Correct the variable name to notesRoute

// Connect to MongoDB Atlas
const connectMongoDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Express middleware setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(fileUpload()); // Enable file uploads
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images'))); // Serve images
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files


app.use(express.json()); // Add this to your server.js

// Set the view engine (if you're using one)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Session middleware
app.use(session({
    secret: 'simpleSecretKey', // Hardcoded secret key
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));




// Route handling
app.use('/', route); // Main app routes
app.use('/', route1); // Teacher routes
app.use('/', route2); // Student routes
app.use('/', route3); // Admin routes
app.use('/billing', billingRoutes); // Billing routes
app.use('/payment', paymentRoutes); // Payment routes
app.use('/cart', cartRoutes); // Cart routes
app.use('/notes', notesRoute); // Notes routes
app.use('/api/courses', courseRoutes); // Use the course routes under the /api/courses endpoint


// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/quiklearn";

connectMongoDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
