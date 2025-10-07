const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true }
});

module.exports = mongoose.model('Achievement', achievementSchema);
