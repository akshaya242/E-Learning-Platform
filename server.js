const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');


const app = express();
const route = require('./routes/quiklearn'); // Route for main application
const route1 = require('./routes/teacherroutes'); // Route for teacher-related endpoints
const route2 = require('./routes/studentroutes'); // Route for student-related endpoints
const route3 = require('./routes/adminRoutes'); // Route for admin-related endpoints
const cartRoutes = require('./routes/cart'); // New cart routes
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notesRoutes = require('./routes/notesRoutes');

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
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
// Serve static files
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use(express.static(path.join(__dirname, "public")));
// Set the view engine (if you're using one)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
// Route setup


// Route handling
app.use('/billing', billingRoutes);
app.use('/payment', paymentRoutes);
app.use('/cart', cartRoutes); 
app.use('/notes', notesRoutes);
app.use('/', route);
app.use('/', route3);
app.use('/',route1);


app.use('/', route2);



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
