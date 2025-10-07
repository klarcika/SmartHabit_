const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit
} = require('../controllers/habit.controller');

router.use(protect);

router.post('/', createHabit);
router.get('/', getHabits);
router.get('/:id', getHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
