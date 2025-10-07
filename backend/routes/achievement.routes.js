const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAchievement,
  getAllAchievements,
  getAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievement.controller');

router.use(protect);

router.post('/', createAchievement);
router.get('/', getAllAchievements);
router.get('/:id', getAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;
