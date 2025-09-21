const Transaction = require('../models/Transaction');

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ message: "Transaction recorded", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions for a user
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
