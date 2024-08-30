const express = require('express');
const path = require('path');
const app = express();
const route = require('./routes/quiklearn'); // Corrected path to the routes file

const { connectMongoDB } = require("./connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
// app.use(express.static('public'));
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
// Set the view engine (if you're using one)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', route); // Use the routes defined in routes.js

// Error handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bhai achse kaam kar');
});

// Start the server
const PORT = process.env.PORT || 3000;
connectMongoDB("mongodb+srv://Project:quiklearn1234@cluster0.nqcn9.mongodb.net/");


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
