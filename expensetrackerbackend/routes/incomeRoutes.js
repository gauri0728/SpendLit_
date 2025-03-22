const express = require('express');
const router = express.Router();
const Income = require('../models/incomeModel');

// ➤ GET all incomes
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ POST a new income
router.post('/', async (req, res) => {
  const { source, amount, date } = req.body;
  try {
    const newIncome = new Income({ source, amount, date });
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ➤ PUT (Update an income)
router.put('/:id', async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ➤ DELETE an income
router.delete('/:id', async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
