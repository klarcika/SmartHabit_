const express = require('express');
const { getOrCreateUser, updateUser, deleteUser,updateUserName } = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getOrCreateUser);
router.put('/', protect, updateUser); 
router.delete('/', protect, deleteUser); 
router.put('/:id', protect, updateUserName);

module.exports = router;
