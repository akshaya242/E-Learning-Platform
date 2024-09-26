const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Route to render the notes page and fetch all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ timestamp: -1 }); // Fetch notes sorted by timestamp
    res.render('notes', { notes }); // Render the notes.ejs page with fetched notes
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).send('Error fetching notes');
  }
});

// Route to save a new note
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    const newNote = new Note({ content });
    await newNote.save(); // Save the note in MongoDB

    res.json({ message: 'Note saved successfully' });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ message: 'Failed to save note' });
  }
});

module.exports = router;

