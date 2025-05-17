const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  updateProfile,
  changePassword,
  getUserStats
} = require('../controllers/user.controller');
const { profileValidation, passwordValidation } = require('../middleware/validation.middleware');

// Все маршруты защищены middleware аутентификации
router.use(protect);

// Маршруты для управления профилем
router.put('/profile', profileValidation, updateProfile);
router.put('/password', passwordValidation, changePassword);
router.get('/stats', getUserStats);

module.exports = router; 