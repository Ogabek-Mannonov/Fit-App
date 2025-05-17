const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');

// Публичные маршруты
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Защищенные маршруты
router.get('/profile', protect, getProfile);

module.exports = router; 