// models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  // id: { type: Number, required: false },
});

module.exports = mongoose.model('Transaction', transactionSchema);
