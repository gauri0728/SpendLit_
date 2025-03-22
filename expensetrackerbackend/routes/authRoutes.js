const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Ensure the Transaction model is imported


const router = express.Router();

// Signup Route
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists!' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });

      // Check if the user is new (based on createdAt and updatedAt)
    // const isNewUser = user._id

    // // Return the token and whether it's a new user
    // return res.json({ token, isNewUser });


  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
