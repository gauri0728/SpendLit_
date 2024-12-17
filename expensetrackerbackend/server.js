const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); // Import only router
const transactionRoutes = require('./routes/transactionRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Adjust the path as needed
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// # MONGO_URI=mongodb+srv://gauri00728:<db_password>@expensetracker.wbzqw.mongodb.net/
// # MONGOUSER:gauri00728,
// # pass:8PFdMWRs1LZi9gp8