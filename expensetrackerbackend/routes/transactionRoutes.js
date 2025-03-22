const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Include this if not already imported

router.post('/', async (req, res) => {
  // const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers
  // if (!token) {
  //   return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    // const userId = decoded.id; // Extract userId from the token

    const { title, amount, category, description, type, date } = req.body;

    const newTransaction = new Transaction({
      title,
      amount,
      category,
      description,
      type,
      date,
    });

    await newTransaction.save();

    console.log(req.body, newTransaction);

    res.status(201).json({
      msg: 'Transaction added successfully',
      transaction: {
        title: newTransaction.title,
        type: newTransaction.type,
        amount: newTransaction.amount,
        category: newTransaction.category,
        description: newTransaction.description,
        date: newTransaction.date,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// // Add a new transaction
// router.post('/', async (req, res) => {
//   const { title, amount, category, description, type, date, userId } = req.body; // Include userId

//   try {
//     const newTransaction = new Transaction({ title, amount, category, description, type, date, userId });
//     await newTransaction.save();
//     console.log(req.body , newTransaction);
    
//     res.status(201).json({
//       msg: 'Transaction added successfully',
//       transaction: {
//         id: newTransaction._id.toString(),
//         title: newTransaction.title,
//         type: newTransaction.type,
//         amount: newTransaction.amount,
//         category: newTransaction.category,
//         description: newTransaction.description,
//         date: newTransaction.date,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// Get all transactions for a user
router.get('/', async (req, res) => {
  const { userId } = req.query; // Get the userId from the query parameters
  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit a transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, description, type, date, userId } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { title, amount, category, description, type, date, userId },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    res.json({ msg: 'Transaction updated successfully', transaction: updatedTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    res.json({ msg: 'Transaction deleted successfully', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Add this route to handle transaction reset in the backend
router.post('/reset', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the header

  if (!token) {
    return res.status(400).json({ msg: 'No token provided' });
  }

  try {
    // Assuming you have a way to decode the token to get the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // User ID from the token

    // Reset all transactions for this user
    await Transaction.deleteMany({ userId }); // Assuming the Transaction model has a userId field

    res.status(200).json({ msg: 'Transactions reset successfully' });
  } catch (error) {
    console.error('Error resetting transactions:', error);
    res.status(500).json({ msg: 'Server error while resetting transactions' });
  }
});


// Delete all transactions for a user when they log in as a new user
router.post('/reset', async (req, res) => {
  const { userId } = req.body;

  try {
    // Delete all transactions for the current user
    await Transaction.deleteMany({ userId });

    res.json({ msg: 'All transactions have been reset for this user' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while resetting transactions' });
  }
});

// Get transactions for a specific filter
router.get('/:filter', async (req, res) => {
  const { filter, userId } = req.params; // Include userId to filter by user
  const today = new Date();
  let startDate;

  switch (filter) {
    case 'week':
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(today.setMonth(today.getMonth() - 1));
      break;
    case '6months':
      startDate = new Date(today.setMonth(today.getMonth() - 6));
      break;
    case 'year':
      startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    default:
      return res.status(400).json({ msg: 'Invalid filter parameter' });
  }

  try {
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching filtered transactions:', error.message);
    res.status(500).json({ msg: 'Server error while fetching transactions' });
  }
});

module.exports = router;
