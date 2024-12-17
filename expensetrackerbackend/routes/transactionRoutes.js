const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Add a new transaction
router.post('/', async (req, res) => {
  const { title, amount, category, description, type, date } = req.body;
  try {
    const newTransaction = new Transaction({ title, amount, category, description, type, date });
    await newTransaction.save();
    res.status(201).json({
      msg: 'Transaction added successfully',
      transaction: {
        id: newTransaction._id,
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

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit a transaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, description, type, date } = req.body;
  console.log(req.body);
  

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { title, amount, category, description, type, date },
      { new: true } // Return the updated document
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


router.get('/:filter', async (req, res) => {
  const { filter } = req.params;

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
      date: { $gte: startDate },
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching filtered transactions:', error.message);
    res.status(500).json({ msg: 'Server error while fetching transactions' });
  }
});


module.exports = router;
