const express = require('express');
const path = require('path');
const mongoose = require('mongoose');



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
connectMongoDB(MONGODB_URI);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


