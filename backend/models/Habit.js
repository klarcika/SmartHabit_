const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['health', 'learning', 'finance', 'social', 'household', 'other'], required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  goal: { type: Number, required: true },
  points: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: String, required: true }
});

module.exports = mongoose.model('Habit', habitSchema);
