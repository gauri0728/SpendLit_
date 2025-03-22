const mongoose = require("mongoose");

const FinanceSchema = new mongoose.Schema({
  sip: { type: Number, required: true },
  hra: { type: Number, required: true },
  loans: { type: Number, required: true },
  savings: { type: Number, required: true },
  travel: { type: Number, required: true },
  stocks: { type: Number, required: true },
  expenses: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Finance", FinanceSchema);
