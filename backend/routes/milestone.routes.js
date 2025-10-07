const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMilestones } = require('../controllers/milestone.controller');

router.get('/', protect, getMilestones);

module.exports = router;