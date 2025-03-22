// models/Transaction.js

// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   amount: { type: Number, required: true },
//   category: { type: String, required: true },
//   title: { type: String, required: true },
//   date: { type: Date, required: true },
//   type: { type: String, required: true },
//   description: { type: String, required: true },
//   // id: { type: Number, required: false },
// });

// module.exports = mongoose.model('Transaction', transactionSchema);



const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true }, // Income or Expense
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);



