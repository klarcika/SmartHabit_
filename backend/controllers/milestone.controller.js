const Milestone = require('../models/Milestone');

const getMilestones = async (req, res) => {
  const userId = req.clerkId;

  try {
    const milestones = await Milestone.find({ user: userId }).populate('habit');
    res.json(milestones);
  } catch (err) {
    console.error('Napaka pri pridobivanju dosežkov:', err);
    res.status(500).json({ message: 'Napaka pri pridobivanju dosežkov' });
  }
};

module.exports = {
  getMilestones
};
