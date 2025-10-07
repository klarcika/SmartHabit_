const Habit = require('../models/Habit');

const createHabit = async (req, res) => {
  const { name, category, frequency, goal } = req.body;
  const userId = req.clerkId;

  try {
    const newHabit = await Habit.create({
      name,
      category,
      frequency,
      goal,
      user: userId
    });
    res.status(201).json(newHabit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Napaka pri ustvarjanju navade' });
  }
};

const getHabits = async (req, res) => {
  const userId = req.clerkId;
  const { frequency, category } = req.query;

  try {
    const query = { user: userId };
    if (frequency) query.frequency = frequency;
    if (category) query.category = category;

    const habits = await Habit.find(query);
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri pridobivanju navad' });
  }
};

const getHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.clerkId;

  try {
    const habit = await Habit.findOne({ _id: id, user: userId });
    if (!habit) return res.status(404).json({ message: 'Navada ni najdena' });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri pridobivanju navade' });
  }
};

const updateHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.clerkId;

  try {
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true }
    );

    if (!updatedHabit) return res.status(404).json({ message: 'Navada ni najdena' });

    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri posodabljanju navade' });
  }
};

const deleteHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.clerkId;

  try {
    const deletedHabit = await Habit.findOneAndDelete({ _id: id, user: userId });

    if (!deletedHabit) return res.status(404).json({ message: 'Navada ni najdena' });

    res.json({ message: 'Navada uspešno izbrisana' });
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri brisanju navade' });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit
};
