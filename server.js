const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');




const app = express();
const route = require('./routes/quiklearn'); // Correct path to the routes file
const route1 = require('./routes/teacherroutes');
const route2 = require('./routes/studentroutes');
const route3 = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cart'); // New cart routes
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



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
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve static files

// Set the view engine
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

// Route handling
app.use('/billing', billingRoutes);
app.use('/payment', paymentRoutes);
app.use('/cart', cartRoutes); // Use the new cart routes here
app.use('/', route);
app.use('/', route3);
app.use('/',route1);




// Route files
const courseRoutes = require('./routes/courses');
app.use('/api/courses', courseRoutes);

// Root route to render the search page
app.get('/', (req, res) => {
  res.render('courses');
});



// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});


// Connect to MongoDB and seed data
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/quiklearn";
connectMongoDB(MONGODB_URI, {connectTimeoutMS: 20000,});

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });


