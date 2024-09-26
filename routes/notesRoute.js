const express = require('express');
const Note = require('../models/Note'); // Assuming the model path is correct
const router = express.Router();
const path = require('path');

// Route to serve the notes page (HTML)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'notes.html')); 
});

// Route to save the note
router.post('/save-note', async (req, res) => {
    try {
        const { content } = req.body;
        const newNote = new Note({ content });
        await newNote.save();
        res.status(200).json({ message: "Note saved successfully!" });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ message: "Failed to save note. Please try again." });
    }
});

module.exports = router;
