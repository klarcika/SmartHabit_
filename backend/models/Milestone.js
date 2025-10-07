const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  user: { type: String, required: true },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  type: { type: String, enum: ['half', 'full'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Milestone', milestoneSchema);
