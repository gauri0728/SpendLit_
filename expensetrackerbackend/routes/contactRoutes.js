const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Assuming you have a Mongoose model for Contact

// POST route to save contact messages
router.post('/add', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();
    res.status(200).json({ msg: 'Contact message saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});

// GET route to fetch all messages (Optional for admin panel)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
});

module.exports = router;
